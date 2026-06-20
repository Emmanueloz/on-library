import { PrismaClient } from "../prisma/prisma-client/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { BcryptService } from "../src/infrastructure/security/bcryptService.ts";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: "./dev.db",
  }),
});

const encryptionService = new BcryptService();

const modules = [
  "categories",
  "chapters",
  "libraries",
  "series",
  "tags",
  "users",
  "following",
  "history",
];
const permissionTypes = ["READ", "WRITE", "DELETE"] as const;

async function main() {
  console.log("Starting seed...");

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

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@onlibrary.com" },
  });

  if (!existingAdmin) {
    const allPermissions = await prisma.permissions.findMany();

    const adminPermissions = allPermissions.map((p) => ({
      idPermission: p.id,
    }));

    await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@onlibrary.com",
        password: await encryptionService.hashPassword("Admin123!"),
        userPermissions: {
          create: adminPermissions,
        },
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
