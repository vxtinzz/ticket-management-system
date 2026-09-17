import type { Ticket } from "../../types/ticket";
export interface Metric {
  label: string;
  value: number;
  description: string;
  tone: "blue" | "amber" | "green" | "red";
}
export function SummaryCards({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="summary-grid">
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className={`summary-card tone-${metric.tone}`}
        >
          <h2>{metric.label}</h2>
          <strong>{metric.value}</strong>
          <p>{metric.description}</p>
        </article>
      ))}
    </div>
  );
}
export function TicketSummary({ tickets }: { tickets: Ticket[] }) {
  return (
    <SummaryCards
      metrics={[
        {
          label: "Em aberto",
          value: tickets.filter((t) => t.status === "OPEN").length,
          description: "total de chamados não iniciados",
          tone: "blue",
        },
        {
          label: "Em andamento",
          value: tickets.filter((t) => t.status === "IN_PROGRESS").length,
          description: "total de chamados em atendimento",
          tone: "amber",
        },
        {
          label: "Resolvidos",
          value: tickets.filter((t) => t.status === "RESOLVED").length,
          description: "total de chamados resolvidos",
          tone: "green",
        },
        {
          label: "Urgentes",
          value: tickets.filter(
            (t) =>
              t.priority === "HIGH" &&
              (t.status === "OPEN" || t.status === "IN_PROGRESS"),
          ).length,
          description: "chamados ativos com prioridade alta",
          tone: "red",
        },
      ]}
    />
  );
}
