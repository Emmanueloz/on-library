import { PrismaClient, UserRole } from "../prisma/prisma-client/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { BcryptService } from "../src/infrastructure/security/bcryptService.ts";
import { ModulePermission, TypePermission } from "@on-library/shared";



const userAdmin ={
  username: process.env.USERNAME_ADMIN,
  email: process.env.EMAIL_ADMIN,
  password: process.env.PASSWORD_ADMIN,
}


const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: "./dev.db",
  }),
});

const encryptionService = new BcryptService();

const modules = Object.values(ModulePermission);

const permissionTypes = Object.values(TypePermission);

async function main() {
  console.log("Starting seed...");

  if (!userAdmin.username || !userAdmin.email || !userAdmin.password) {
    console.error("Admin user credentials are not set in environment variables.");
    process.exit(1);
  }

  for (const module of modules) {
    for (const type of permissionTypes) {
      try {
        await prisma.permissions.upsert({
          where: { name_type: { name: module, type } },
          update: {},
          create: { name: module, type },
        });
      } catch (e: any) {
        if (e.code !== "P2002") {
          console.error(
            `Error creating permission ${module}/${type}:`,
            e.message,
          );
        }
      }
    }
  }
  console.log("Permissions created/updated");

  const existingAdmin = await prisma.user.findFirst({
    where: { role: UserRole.ROOT },
  });

  if (!existingAdmin) {
    const allPermissions = await prisma.permissions.findMany();

    const adminPermissions = allPermissions.map((p) => ({
      idPermission: p.id,
    }));

    await prisma.user.create({
      data: {
        username: userAdmin.username,
        email: userAdmin.email,
        password: await encryptionService.hashPassword(userAdmin.password),
        userPermissions: {
          create: adminPermissions,
        },
        role: "ROOT",
      },
    });
    console.log("Admin user created with all permissions");
  } else {
    console.log("Admin user already exists");
  }

  const categories = [
    "Manga", "Manhwa", "Manhua", "Comic",
    "Light Novela", "Webtoon", "Novela",
  ];

  for (const name of categories) {
    try {
      await prisma.categories.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    } catch (e: any) {
      if (e.code !== "P2002") {
        console.error(`Error creating category ${name}:`, e.message);
      }
    }
  }
  console.log(`${categories.length} categories created/updated`);

  const tags = [
    "Acción", "Aventura", "Comedia", "Drama", "Fantasía",
    "Romance", "Ciencia Ficción", "Sobrenatural", "Terror",
    "Thriller", "Deportes", "Slice of Life", "Mecha",
    "Militar", "Misterio", "Psicológico", "Historia",
    "Artes Marciales", "Tragedia", "Musical", "Harem",
    "Isekai", "Ecchi", "Seinen", "Shounen", "Shoujo", "Josei",
  ];

  for (const name of tags) {
    try {
      await prisma.tags.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    } catch (e: any) {
      if (e.code !== "P2002") {
        console.error(`Error creating tag ${name}:`, e.message);
      }
    }
  }
  console.log(`${tags.length} tags created/updated`);

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
