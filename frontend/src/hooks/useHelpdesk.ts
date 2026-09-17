import { useCallback, useEffect, useRef, useState } from "react";
import { getTickets } from "../services/tickets.service";
import { getResponsibles } from "../services/responsibles.service";
import type { Ticket } from "../types/ticket";
import type { Responsible } from "../types/responsible";

async function loadTickets() {
  const first = (await getTickets()).response;
  const result = [...first.tickets];
  for (let page = 2; page <= first.pagination.totalPages; page++) {
    result.push(...(await getTickets(page)).response.tickets);
  }
  return [...new Map(result.map((item) => [item.id, item])).values()];
}

async function loadResponsibles() {
  const first = (await getResponsibles()).response;
  const result = [...first.responsibles];
  for (let page = 2; page <= first.pagination.totalPages; page++) {
    result.push(...(await getResponsibles(page)).response.responsibles);
  }
  return [...new Map(result.map((item) => [item.id, item])).values()];
}

export function useHelpdesk() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const versionRef = useRef(0);
  const load = useCallback(async () => {
    const request = ++versionRef.current;
    try {
      const [nextTickets, nextResponsibles] = await Promise.all([
        loadTickets(),
        loadResponsibles(),
      ]);
      if (request !== versionRef.current) return false;
      setTickets(nextTickets);
      setResponsibles(nextResponsibles);
      setError("");
      return true;
    } catch (error) {
      if (request === versionRef.current)
        setError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados.",
        );
      return false;
    } finally {
      if (request === versionRef.current) setLoading(false);
    }
  }, []);
  const refresh = useCallback(() => {
    setLoading(true);
    setError("");
    return load();
  }, [load]);
  useEffect(() => {
    const generation = versionRef;
    void load();
    return () => {
      generation.current++;
    };
  }, [load]);
  return { tickets, responsibles, loading, error, refresh };
}
