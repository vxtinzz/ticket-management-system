import { TicketPriority } from "../generated/prisma/enums";
import * as ticketRepository from "../repositories/ticket.repository";
import * as responsibleRepository from "../repositories/responsible.repository";

interface AddTicketData {
  title: string;
  description: string;
  priority: TicketPriority;
  responsibleId?: string;
}

export async function addTicket(data: AddTicketData) {
  let responsibleId = data.responsibleId;

  if (responsibleId) {
    const responsible = await responsibleRepository.findById(responsibleId);

    if (!responsible) {
      throw new Error("Responsible not found");
    }
  }


  if (!responsibleId) {
    const responsible = await responsibleRepository.findWithFewestOpenTickets();

    if (!responsible) {
      throw new Error("No responsible available");
    }

    responsibleId = responsible.id;
  }

  const ticket = await ticketRepository.create({
    title: data.title,
    description: data.description,
    priority: data.priority,
    responsibleId
  });

  return ticket;
}

export async function getAllTickets(search: any, page: number, limit: number, sortBy: string, order: string) {
  const ticketsData = await ticketRepository.findAll(search, page, limit, sortBy, order)
  const totalTickets = await ticketRepository.countTickets()

  return {
    tickets: ticketsData,
    pagination: {
        page,
        limit,
        totalTickets,
        totalPages: Math.ceil(totalTickets / limit)
    }
  }
}

export async function getTicketById(id: string) {
    const ticket = await ticketRepository.findById(id)
    
    if(!ticket){
        throw new Error("Ticket not found")
    }

    return ticket;
}

export async function getAllResponsibles(page: number, limit: number, order: "asc" | "desc") {
  const responsiblesData = await responsibleRepository.findAll(page, limit, order)
  const totalresponsibles = await responsibleRepository.countResponsibles()

  return {
    responsibles: responsiblesData,
    pagination: {
        page,
        limit,
        totalresponsibles,
        totalPages: Math.ceil(totalresponsibles / limit)
    }
  }
}

export async function getResponsibleById(id: string) {
    const responsible = await responsibleRepository.findById(id)
    
    if(!responsible){
        throw new Error("Responsible not found")
    }

    return responsible;
}

export async function updateTicketById(id: string, data: any) {
    const ticket = await ticketRepository.findById(id)

    if(!ticket){
        throw new Error("Ticket not found")
    }

    if (data.responsibleId) {
    const responsible = await responsibleRepository.findById(data.responsibleId);

    if (!responsible) {
      throw new Error("Responsible not found");
    }
  }

    return ticketRepository.update(id, data)
}

export async function deleteTicketById(id: string) {
    const ticket = await ticketRepository.findById(id)

    if(!ticket){
        throw new Error("Ticket not found")
    }

    return await ticketRepository.deleteTicketById(id)
}