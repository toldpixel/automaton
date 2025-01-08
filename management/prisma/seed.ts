import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  console.log("Seeding data...");

  const website1 = await prisma.website.create({
    data: {
      url: "https://example.com",
      selectors: { title: "h1", description: ".desc" },
    },
  });

  const website2 = await prisma.website.create({
    data: {
      url: "https://another-example.com",
      selectors: { title: "h1", links: "a[href]" },
    },
  });

  console.log({ website1, website2 });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1); //! @types/node doesnt fix the error
  });
