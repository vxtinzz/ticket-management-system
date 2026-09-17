import type { Ticket, TicketStatus } from "../types/ticket";
import { TicketSummary } from "../components/ui/SummaryCards";
import { PriorityBadge } from "../components/tickets/TicketBadges";
import { statuses } from "../utils/tickets";

const segments: { status: TicketStatus; color: string }[] = [
  { status: "OPEN", color: "#5286e9" },
  { status: "IN_PROGRESS", color: "#e5ad48" },
  { status: "RESOLVED", color: "#409c70" },
  { status: "CLOSED", color: "#c2cbd7" },
];

export function Dashboard({
  tickets,
  onView,
}: {
  tickets: Ticket[];
  onView: (ticket: Ticket) => void;
}) {
  const latest = [...tickets]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 5);
  const counts = segments.map((s) => ({
    ...s,
    count: tickets.filter((t) => t.status === s.status).length,
  }));
  let cursor = 0;
  const gradient = counts
    .map((s) => {
      const start = cursor;
      cursor += tickets.length ? (s.count / tickets.length) * 100 : 0;
      return `${s.color} ${start}% ${cursor}%`;
    })
    .join(", ");
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Aqui está um resumo dos chamados da sua equipe.</p>
        </div>
      </div>
      <TicketSummary tickets={tickets} />
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>Últimos chamados</h2>
            <a href="#/tickets" className="text-link">
              Ver todos
            </a>
          </div>
          {latest.length ? (
            latest.map((t) => (
              <button
                key={t.id}
                className="recent-ticket"
                onClick={() => onView(t)}
              >
                <span className="ticket-id">{t.id}</span>
                <span>{t.title}</span>
                <PriorityBadge value={t.priority} />
              </button>
            ))
          ) : (
            <div className="empty-state">Nenhum chamado cadastrado.</div>
          )}
        </section>
        <section className="panel chart-panel">
          <h2>Chamados por status</h2>
          <div className="chart-content">
            <div
              className="donut"
              role="img"
              aria-label={`${tickets.length} chamados. ${counts.map((s) => `${statuses[s.status]}: ${s.count}`).join(". ")}`}
              style={{
                background: tickets.length
                  ? `conic-gradient(${gradient})`
                  : "#e5e9ef",
              }}
            >
              <div>
                <strong>{tickets.length}</strong>
                <span>total</span>
              </div>
            </div>
            <ul className="chart-legend">
              {counts.map((s) => (
                <li key={s.status}>
                  <i style={{ background: s.color }} />
                  <span>{statuses[s.status]}</span>
                  <strong>{s.count}</strong>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
