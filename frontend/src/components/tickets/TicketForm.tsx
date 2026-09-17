import { useState, type FormEvent } from "react";
import type {
  Ticket,
  CreateTicketDTO,
  UpdateTicketDTO,
  Priority,
  TicketStatus,
} from "../../types/ticket";
import type { Responsible } from "../../types/responsible";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { priorityOptions, statusOptions } from "../../utils/tickets";

interface Props {
  ticket?: Ticket;
  responsibles: Responsible[];
  busy: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (data: CreateTicketDTO | UpdateTicketDTO) => Promise<void>;
}

export function TicketForm({
  ticket,
  responsibles,
  busy,
  error,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(ticket?.title ?? "");
  const [description, setDescription] = useState(ticket?.description ?? "");
  const [priority, setPriority] = useState<Priority>(ticket?.priority ?? "LOW");
  const [status, setStatus] = useState<TicketStatus>(ticket?.status ?? "OPEN");
  const [responsibleId, setResponsibleId] = useState(
    ticket?.responsibleId ?? "",
  );
  const [validation, setValidation] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (!title.trim() || !description.trim()) {
      setValidation("Preencha o título e a descrição.");
      return;
    }
    setValidation("");
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      ...(ticket ? { status } : {}),
      ...(responsibleId ? { responsibleId } : {}),
    });
  }

  const options = responsibles.map((r) => ({ value: r.id, label: r.name }));
  if (!ticket)
    options.unshift({ value: "", label: "Automático (menos chamados)" });
  else if (!options.some((r) => r.value === ticket.responsibleId))
    options.unshift({
      value: ticket.responsibleId,
      label: "Responsável atual",
    });
  return (
    <Modal
      isOpen
      title={
        <>
          {ticket ? "Editar chamado" : "Novo chamado"}
          {ticket && <small className="modal-id">#{ticket.id}</small>}
        </>
      }
      busy={busy}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" disabled={busy} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="ticket-form"
            disabled={busy || !responsibles.length}
          >
            {busy
              ? "Salvando..."
              : ticket
                ? "Salvar alterações"
                : "Criar chamado"}
          </Button>
        </>
      }
    >
      <form id="ticket-form" onSubmit={submit}>
        <fieldset disabled={busy} className="form-fields">
          <Input
            autoFocus
            id="ticket-title"
            label="Título *"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Descreva o problema de forma resumida"
          />
          <Textarea
            id="ticket-description"
            label="Descrição *"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o problema em mais detalhes..."
            className="min-h-40"
          />
          <div className="form-row">
            <Select
              id="ticket-priority"
              label="Prioridade *"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              options={priorityOptions}
            />
            {ticket ? (
              <Select
                id="ticket-status"
                label="Status *"
                value={status}
                onChange={(e) => setStatus(e.target.value as TicketStatus)}
                options={statusOptions}
              />
            ) : (
              <Select
                id="ticket-responsible"
                label="Responsável *"
                value={responsibleId}
                onChange={(e) => setResponsibleId(e.target.value)}
                options={options}
              />
            )}
          </div>
          {ticket && (
            <Select
              id="ticket-responsible"
              label="Responsável *"
              required
              value={responsibleId}
              onChange={(e) => setResponsibleId(e.target.value)}
              options={options}
            />
          )}
          {!responsibles.length && (
            <p role="alert" className="form-error">
              Cadastre responsáveis no backend antes de criar chamados.
            </p>
          )}
          {(error || validation) && (
            <p role="alert" className="form-error">
              {error || validation}
            </p>
          )}
        </fieldset>
      </form>
    </Modal>
  );
}
