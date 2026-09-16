import prisma from "../src/config/prisma";

async function main() {
  await prisma.responsible.createMany({
    data: [
      { name: "Suporte - Victor[TI]" },
      { name: "Suporte - Yhasmin[Compras]" },
      { name: "Suporte - Rafael[Infraestrutura]" }
    ]
  });

  console.log("Seed completed successfully");
}

main()
    .then(()=>{
        console.log("Database seeded!!");})
    .finally(async () => {
        await prisma.$disconnect();
    });