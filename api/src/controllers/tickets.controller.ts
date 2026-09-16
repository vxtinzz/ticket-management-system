import { Request, Response } from "express"
import * as validators from "../utils/validators"
import * as ticketService from "../services/ticket.service"

export async function addTicket(req: Request, res: Response) {
  try {
    const ticket = validators.ticketCreateSchema.parse(req.body);

    await ticketService.addTicket(ticket)
    res.status(201).json({state: "sucess", message: "Ticket successfully created"})
  } catch (err: any) {
    res.status(400).json({state: "error", code: "CREATE_TICKET_FAILED", message: err.message})
  }
}

export async function getTickets(req: Request, res: Response) {
  try {
    const limit = 10
    const { page, sortBy, order } = validators.ticketPaginationSchema.parse(req.query)

    const tickets = await ticketService.getAllTickets(page, limit, sortBy, order)
    res.status(200).json({state: "sucess", message: "Tickets successfully retrieved", response: tickets})
  } catch (err:any) {
    res.status(400).json({state: "error", code: "GET_TICKETS_FAILED", message: err.message})
  }
}

export async function getTicketById(req: Request, res: Response) {
  try {
    const { id } = validators.ticketIdSchema.parse(req.params)
    
    const ticket = await ticketService.getTicketById(id)
    if (!ticket) {
      return res.status(404).json({state: "error", code: "GET_TICKET_BY_ID_FAILED", message: "Ticket Not Found"})
    }
      res.status(200).json({state: "sucess", message: "Ticket successfully retrieved", response: ticket})
  } catch (err: any) {
    res.status(400).json({state: "error", code: "GET_TICKET_BY_ID_FAILED", message: err.message})
  }
}

export async function getResponsibles(req: Request, res: Response) {
  try {
    const limit = 10
    const { page, sortBy, order } = validators.ticketPaginationSchema.parse(req.query)

    const responsibles = await ticketService.getAllResponsibles(page, limit, sortBy, order)
    res.status(200).json({state: "sucess", message: "Responsibles successfully retrieved", response: responsibles})
  } catch (err:any) {
    res.status(400).json({state: "error", code: "GET_RESPONSIBLES_FAILED", message: err.message})
  }
}

export async function getResponsibleById(req: Request, res: Response) {
  try {
    const { id } = validators.ticketIdSchema.parse(req.params)
    const responsible = await ticketService.getResponsibleById(id)
    if (!responsible) {
      return res.status(404).json({state: "error", code: "GET_RESPONSIBLE_BY_NAME_FAILED", message: "Responsible Not Found"})
    }
      res.status(200).json({state: "sucess", message: "Responsible successfully retrieved", response: responsible})
  } catch (err: any) {
    res.status(400).json({state: "error", code: "GET_RESPONSIBLE_BY_NAME_FAILED", message: err.message})
  }
}

export async function updateTicketById(req: Request, res: Response) {
  try {
    const { id } = validators.ticketIdSchema.parse(req.params)
    const dataUpdate = validators.ticketUpdateSchema.parse(req.body)
    await ticketService.updateTicketById(id, dataUpdate)
    res.status(200).json({state: "sucess", message: "Ticket successfully updated"})
  } catch (err: any) {
    res.status(422).json({state: "error", code: "UPDATE_TICKET_FAILED", message: err.message})
  }
}

export async function deleteTicket(req: Request, res: Response) {
  try {
    const { id } = validators.ticketIdSchema.parse(req.params)
    
    await ticketService.deleteTicketById(id)
    res.status(200).json({state: "sucess", message: "Ticket successfully deleted"})
  } catch (err: any) {
    res.status(422).json({state: "error", code: "DELETE_TICKET_FAILED", message: err.message})
  }
}
