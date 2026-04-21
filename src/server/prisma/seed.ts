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
