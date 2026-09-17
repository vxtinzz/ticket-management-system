import { api } from "./api";

import type {
  ApiResponse,
  ResponsiblesResponse,
} from "../types/api";

import type { Responsible } from "../types/responsible";

export function getResponsibles(page = 1, limit = 100) {
  return api<ApiResponse<ResponsiblesResponse>>(
    `/responsibles?page=${page}&limit=${limit}`
  );
}

export function getResponsibleById(id: string) {
  return api<ApiResponse<Responsible>>(
    `/responsible/${id}`
  );
}