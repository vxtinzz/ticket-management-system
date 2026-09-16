import prisma from "../config/prisma"

export function findAll(page: number, limit: number, order: "asc" | "desc") {
  return prisma.responsible.findMany({
    skip: (page - 1) * limit,
    take: limit,
    
    orderBy: {
      name: order
    }
  });
}

export function countResponsibles() {
  return prisma.responsible.count();
}

export function findById(id: string) {
  return prisma.responsible.findUnique({
    where: { id },
  })
}

export async function findWithFewestOpenTickets() {
  const responsibles = await prisma.responsible.findMany({
    select: {
      id: true,
      name: true,

      _count: {
        select: {
          tickets: {
            where: {
              status: {
                in: ["OPEN", "IN_PROGRESS"]
              }
            }
          }
        }
      }
    }
  });

  if (responsibles.length === 0) {
    return null;
  }

  return responsibles.reduce((fewest, current) => {
    return current._count.tickets < fewest._count.tickets? current : fewest;
  });
}

export function update(id: string, data: any) {
  return prisma.responsible.update({
    where: { id },
    data,
  })
}