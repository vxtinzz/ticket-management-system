import { useEffect, useState } from "react";
import type { Ticket } from "../../types/ticket";
import type { Responsible } from "../../types/responsible";
import { getTicketById } from "../../services/tickets.service";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { PriorityBadge, StatusBadge } from "./TicketBadges";
import { formatDate } from "../../utils/tickets";

export function TicketDetails({
  ticket,
  responsibles,
  onClose,
  onEdit,
  onCloseTicket,
}: {
  ticket: Ticket;
  responsibles: Responsible[];
  onClose: () => void;
  onEdit: (ticket: Ticket) => void;
  onCloseTicket: (ticket: Ticket) => void;
}) {
  const [fresh, setFresh] = useState(ticket);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    getTicketById(ticket.id)
      .then((data) => {
        if (!cancelled) setFresh(data.response);
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "Não foi possível atualizar os detalhes. Exibindo a última versão carregada.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ticket.id]);
  return (
    <Modal
      isOpen
      title={
        <>
          Chamado <small className="modal-id">#{fresh.id}</small>
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Voltar
          </Button>
          {fresh.status !== "CLOSED" && (
            <Button
              disabled={loading || !!error}
              onClick={() => onCloseTicket(fresh)}
            >
              Fechar chamado
            </Button>
          )}
        </>
      }
    >
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <div className="detail-heading">
        <div>
          <h3>{fresh.title}</h3>
          <small>Aberto em {formatDate(fresh.createdAt)}</small>
        </div>
        <Button
          variant="secondary"
          disabled={loading || !!error}
          onClick={() => onEdit(fresh)}
        >
          Editar
        </Button>
      </div>
      <section className="detail-box">
        <h4>Descrição</h4>
        <p className="description-text">{fresh.description}</p>
        <dl className="detail-grid">
          <div>
            <dt>Status</dt>
            <dd>
              <StatusBadge value={fresh.status} />
            </dd>
          </div>
          <div>
            <dt>Prioridade</dt>
            <dd>
              <PriorityBadge value={fresh.priority} />
            </dd>
          </div>
          <div>
            <dt>Responsável</dt>
            <dd>
              {responsibles.find((r) => r.id === fresh.responsibleId)?.name ??
                "Responsável não encontrado"}
            </dd>
          </div>
        </dl>
        <div className="updated-at">
          <strong>Última atualização</strong>
          <p>{formatDate(fresh.updatedAt)}</p>
        </div>
      </section>
    </Modal>
  );
}
