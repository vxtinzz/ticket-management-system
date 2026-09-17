import { useState } from "react";
import type { Ticket } from "../types/ticket";
import type { Responsible } from "../types/responsible";
import { TicketSummary } from "../components/ui/SummaryCards";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Icon } from "../components/ui/Icon";
import { Pagination } from "../components/ui/Pagination";
import { StatusBadge, PriorityBadge } from "../components/tickets/TicketBadges";
import {
  formatDate,
  normalize,
  priorityOptions,
  statusOptions,
} from "../utils/tickets";

interface Props {
  tickets: Ticket[];
  responsibles: Responsible[];
  onCreate: () => void;
  onView: (ticket: Ticket) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
}

export function Tickets({
  tickets,
  responsibles,
  onCreate,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");
  const [responsible, setResponsible] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const filtered = tickets
    .filter(
      (t) =>
        normalize(t.title).includes(normalize(search)) &&
        (!responsible || t.responsibleId === responsible) &&
        (!status || t.status === status) &&
        (!priority || t.priority === priority),
    )
    .sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title, "pt-BR")
        : sort === "oldest"
          ? Date.parse(a.createdAt) - Date.parse(b.createdAt)
          : Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const current = Math.min(page, pages);
  const reset = () => {
    setSearch("");
    setResponsible("");
    setStatus("");
    setPriority("");
    setPage(1);
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Chamados</h1>
          <p>
            Gerencie os chamados da sua equipe. Adicione, edite e organize as
            informações.
          </p>
        </div>
        <Button onClick={onCreate}>
          <span className="plus">+</span>Novo chamado
        </Button>
      </div>
      <TicketSummary tickets={tickets} />
      <div className="filters">
        <div className="search-field">
          <Input
            aria-label="Buscar chamados"
            placeholder="Buscar por nome do chamado..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Icon name="search" />
        </div>
        <Select
          aria-label="Filtrar por responsável"
          value={responsible}
          onChange={(e) => {
            setResponsible(e.target.value);
            setPage(1);
          }}
          options={[
            { value: "", label: "Responsável" },
            ...responsibles.map((r) => ({ value: r.id, label: r.name })),
          ]}
        />
        <Select
          aria-label="Filtrar por status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          options={[{ value: "", label: "Status" }, ...statusOptions]}
        />
        <Select
          aria-label="Filtrar por prioridade"
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            setPage(1);
          }}
          options={[{ value: "", label: "Prioridade" }, ...priorityOptions]}
        />
        <Select
          aria-label="Ordenar chamados"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          options={[
            { value: "recent", label: "Mais recentes" },
            { value: "oldest", label: "Mais antigos" },
            { value: "title", label: "Título A–Z" },
          ]}
        />
      </div>
      {(search || responsible || status || priority) && (
        <button className="text-link mb-4" onClick={reset}>
          Limpar filtros
        </button>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="id-column">#</th>
              <th>Título do chamado</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Responsável</th>
              <th>Abertura</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice((current - 1) * 10, current * 10).map((t) => (
              <tr key={t.id}>
                <td className="ticket-id">{t.id}</td>
                <td>
                  <button className="ticket-title" onClick={() => onView(t)}>
                    {t.title}
                  </button>
                </td>
                <td>
                  <StatusBadge value={t.status} />
                </td>
                <td>
                  <PriorityBadge value={t.priority} />
                </td>
                <td>
                  {responsibles.find((r) => r.id === t.responsibleId)?.name ??
                    "Responsável não encontrado"}
                </td>
                <td className="date-cell">{formatDate(t.createdAt)}</td>
                <td>
                  <div className="row-actions">
                    <button
                      className="icon-button"
                      aria-label={`Editar ${t.title}`}
                      onClick={() => onEdit(t)}
                    >
                      <Icon name="edit" />
                    </button>
                    <button
                      className="icon-button"
                      aria-label={`Excluir ${t.title}`}
                      onClick={() => onDelete(t)}
                    >
                      <Icon name="delete" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <strong>
                      {tickets.length
                        ? "Nenhum chamado encontrado"
                        : "Nenhum chamado cadastrado"}
                    </strong>
                    <p>
                      {tickets.length
                        ? "Experimente alterar ou limpar os filtros."
                        : "Clique em Novo chamado para começar."}
                    </p>
                  </div>
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
