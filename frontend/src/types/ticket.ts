export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  responsibleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDTO {
  title: string;
  description: string;
  priority: Priority;
  responsibleId?: string;
}

export interface UpdateTicketDTO {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TicketStatus;
  responsibleId?: string;
}