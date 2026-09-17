import { api } from "./api";

import type {
  ApiResponse,
  TicketsResponse,
} from "../types/api";

import type {
  Ticket,
  CreateTicketDTO,
  UpdateTicketDTO,
} from "../types/ticket";

export function getTickets(page = 1, limit = 100) {
  return api<ApiResponse<TicketsResponse>>(`/tickets?page=${page}&limit=${limit}`);
}

export function getTicketById(id: string) {
  return api<ApiResponse<Ticket>>(`/tickets/${id}`);
}

export function createTicket(data: CreateTicketDTO) {
  return api("/tickets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateTicket(
  id: string,
  data: UpdateTicketDTO
) {
  return api(`/tickets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteTicket(id: string) {
  return api(`/tickets/${id}`, {
    method: "DELETE",
  });
}