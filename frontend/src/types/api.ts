export interface ApiResponse<T> {
  state: string;
  message: string;
  response: T;
}

export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
}

export interface TicketsResponse {
  tickets: import("./ticket").Ticket[];
  pagination: Pagination & {
    totalTickets: number;
  };
}

export interface ResponsiblesResponse {
  responsibles: import("./responsible").Responsible[];
  pagination: Pagination & {
    totalresponsibles: number;
  };
}