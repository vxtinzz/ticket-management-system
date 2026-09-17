import type { Ticket, TicketStatus, Priority } from "../types/ticket";

export const statuses: Record<TicketStatus, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em andamento",
  RESOLVED: "Resolvido",
  CLOSED: "Fechado",
};

export const priorities: Record<Priority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

export const statusOptions = Object.entries(statuses).map(([value, label]) => ({
  value,
  label,
}));

export const priorityOptions = Object.entries(priorities).map(
  ([value, label]) => ({ value, label }),
);

export const isActive = (ticket: Ticket) =>
  ticket.status === "OPEN" || ticket.status === "IN_PROGRESS";

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
  
export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
