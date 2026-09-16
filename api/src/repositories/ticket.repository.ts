import prisma from "../config/prisma"

export function findAll(page: number, limit: number, sortBy: string, order: string) {
  return prisma.ticket.findMany({
    skip: (page - 1) * limit,
    take: limit,
    
    orderBy: {
      [sortBy]: order
    }
  });
}

export function countTickets() {
  return prisma.ticket.count();
}

export function findById(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
  })
}

export function create(data: any) {
  return prisma.ticket.create({ data })
}

export function update(id: string, data: any) {
  return prisma.ticket.update({
    where: { id },
    data,
  })
}

export function deleteTicketById(id: string) {
  return prisma.ticket.delete({
    where: { id }
  })
}