import { useState } from "react";
import type { Responsible } from "../types/responsible";
import type { Ticket } from "../types/ticket";
import { SummaryCards } from "../components/ui/SummaryCards";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { Icon } from "../components/ui/Icon";
import { Pagination } from "../components/ui/Pagination";
import { isActive, normalize } from "../utils/tickets";

export function Responsibles({
  responsibles,
  tickets,
}: {
  responsibles: Responsible[];
  tickets: Ticket[];
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const busyIds = new Set(tickets.filter(isActive).map((t) => t.responsibleId));
  const busy = responsibles.filter((r) => busyIds.has(r.id)).length;
  const filtered = responsibles.filter(
    (r) =>
      normalize(r.name).includes(normalize(search)) &&
      (!status || (status === "busy" ? busyIds.has(r.id) : !busyIds.has(r.id))),
  );

  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const current = Math.min(page, pages);
  
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Responsáveis</h1>
          <p>Acompanhe os responsáveis pelo atendimento da sua equipe.</p>
        </div>
      </div>
      <SummaryCards
        metrics={[
          {
            label: "Colaboradores",
            value: responsibles.length,
            description: "total de colaboradores",
            tone: "blue",
          },
          {
            label: "Em atendimento",
            value: busy,
            description: "colaboradores com chamados ativos",
            tone: "amber",
          },
          {
            label: "Disponíveis",
            value: responsibles.length - busy,
            description: "colaboradores sem chamados ativos",
            tone: "green",
          },
        ]}
      />
      <div className="filters responsible-filters">
        <div className="search-field">
          <Input
            aria-label="Buscar responsáveis"
            placeholder="Buscar por nome do colaborador..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Icon name="search" />
        </div>
        <Select
          aria-label="Filtrar disponibilidade"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          options={[
            { value: "", label: "Todos os status" },
            { value: "free", label: "Disponível" },
            { value: "busy", label: "Em atendimento" },
          ]}
        />
      </div>
      <div className="table-wrap">
        <table className="responsibles-table">
          <thead>
            <tr>
              <th className="id-column">#</th>
              <th>Nome</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice((current - 1) * 10, current * 10).map((r) => (
              <tr key={r.id}>
                <td className="ticket-id">{r.id}</td>
                <td>{r.name}</td>
                <td>
                  <Badge
                    variant={busyIds.has(r.id) ? "inProgress" : "resolved"}
                  >
                    {busyIds.has(r.id) ? "Em atendimento" : "Disponível"}
                  </Badge>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={3} className="empty-state">
                  Nenhum responsável encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={current}
        totalPages={pages}
        total={filtered.length}
        onChange={setPage}
      />
    </>
  );
}
