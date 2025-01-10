import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ChatGPT generated and adjusted seed
async function main() {
  console.log("Seeding data...");

  //! Comment out seed when needed
  /*const metadata1 = await prisma.metadata.create({
    data: {
      priority: "",
      scheduleFrequency: "",
      addedAt: new Date().toISOString(),
    },
  });

  const metadata2 = await prisma.metadata.create({
    data: {
      priority: "",
      scheduleFrequency: "",
      addedAt: new Date().toISOString(),
    },
  });

  const metadata3 = await prisma.metadata.create({
    data: {
      priority: "",
      scheduleFrequency: "",
      addedAt: new Date().toISOString(),
    },
  });

  const metadata4 = await prisma.metadata.create({
    data: {
      priority: "",
      scheduleFrequency: "",
      addedAt: new Date().toISOString(),
    },
  });

  const website1 = await prisma.website.create({
    data: {
      url: "https://example.com",
      selectors: "h1, .desc",
      metadataId: metadata1.id,
    },
  });

  const website2 = await prisma.website.create({
    data: {
      url: "https://another-example.com",
      selectors: "h1, a[href]",
      metadataId: metadata2.id,
    },
  });

  const website3 = await prisma.website.create({
    data: {
      url: "https://sample-site.com",
      selectors: "#main-title, .content-section",
      metadataId: metadata3.id,
    },
  });

  const website4 = await prisma.website.create({
    data: {
      url: "https://demo-site.org",
      selectors: "header, footer, .article",
      metadataId: metadata4.id,
    },
  });

  console.log({ website1, website2, website3, website4 });*/
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
