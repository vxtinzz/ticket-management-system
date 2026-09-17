import { useCallback, useEffect, useRef, useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import type { SidebarItem } from "./components/layout/Sidebar";
import { Tickets } from "./pages/Tickets";
import { Dashboard } from "./pages/Dashboard";
import { Responsibles } from "./pages/Responsibles";
import { useHelpdesk } from "./hooks/useHelpdesk";
import { TicketForm } from "./components/tickets/TicketForm";
import { TicketDetails } from "./components/tickets/TicketDetails";
import { Modal } from "./components/ui/Modal";
import { Button } from "./components/ui/Button";
import { Icon } from "./components/ui/Icon";
import { Toast, type ToastMessage } from "./components/ui/Toast";
import {
  createTicket,
  updateTicket,
  deleteTicket,
} from "./services/tickets.service";
import type { Ticket, CreateTicketDTO, UpdateTicketDTO } from "./types/ticket";

type ActiveModal =
  | { kind: "create" }
  | { kind: "edit" | "view" | "delete" | "close"; ticket: Ticket }
  | null;
const getPage = (): SidebarItem => {
  const name = window.location.hash.slice(2);
  return name === "home" || name === "responsibles" ? name : "tickets";
};

function App() {
  const [page, setPage] = useState(getPage);
  const [modal, setModal] = useState<ActiveModal>(null);
  const [busy, setBusy] = useState(false);
  const mutationLock = useRef(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const data = useHelpdesk();
  useEffect(() => {
    const navigate = () => {
      setPage(getPage());
      if (!mutationLock.current) setModal(null);
    };
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);
  const open = (next: ActiveModal) => {
    setFormError("");
    setModal(next);
  };
  const close = () => {
    if (!mutationLock.current) setModal(null);
  };
  const view = (ticket: Ticket) => open({ kind: "view", ticket });
  async function mutate(operation: () => Promise<unknown>, title: string) {
    if (mutationLock.current) return;
    mutationLock.current = true;
    setBusy(true);
    setFormError("");
    try {
      await operation();
      setModal(null);
      setToast({ id: Date.now(), kind: "success", title });
      const refreshed = await data.refresh();
      if (!refreshed)
        setToast({
          id: Date.now(),
          kind: "error",
          title: "Alteração salva, mas a lista não foi atualizada.",
          description: "Use Tentar novamente para recarregar os dados.",
        });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Tente novamente.";
      setFormError(message);
      setToast({
        id: Date.now(),
        kind: "error",
        title: "Não foi possível concluir a ação",
        description: message,
      });
    } finally {
      mutationLock.current = false;
      setBusy(false);
    }
  }
  async function save(payload: CreateTicketDTO | UpdateTicketDTO) {
    if (modal?.kind === "create")
      await mutate(
        () => createTicket(payload as CreateTicketDTO),
        "Chamado criado com sucesso!",
      );
    else if (modal?.kind === "edit")
      await mutate(
        () => updateTicket(modal.ticket.id, payload),
        "Chamado atualizado com sucesso!",
      );
  }
  return (
    <>
      <AppLayout activeItem={page}>
        {data.loading ? (
          <div className="loading-state" role="status">
            <span className="spinner" />
            Carregando dados...
          </div>
        ) : data.error ? (
          <section className="error-state" role="alert">
            <h1>Não foi possível carregar os dados</h1>
            <p>{data.error}</p>
            <Button onClick={() => void data.refresh()}>
              Tentar novamente
            </Button>
          </section>
        ) : page === "home" ? (
          <Dashboard tickets={data.tickets} onView={view} />
        ) : page === "responsibles" ? (
          <Responsibles
            tickets={data.tickets}
            responsibles={data.responsibles}
          />
        ) : (
          <Tickets
            tickets={data.tickets}
            responsibles={data.responsibles}
            onCreate={() => open({ kind: "create" })}
            onView={view}
            onEdit={(ticket) => open({ kind: "edit", ticket })}
            onDelete={(ticket) => open({ kind: "delete", ticket })}
          />
        )}
      </AppLayout>
      {(modal?.kind === "create" || modal?.kind === "edit") && (
        <TicketForm
          key={modal.kind === "edit" ? modal.ticket.id : "new"}
          ticket={modal.kind === "edit" ? modal.ticket : undefined}
          responsibles={data.responsibles}
          busy={busy}
          error={formError}
          onClose={close}
          onSubmit={save}
        />
      )}
      {modal?.kind === "view" && (
        <TicketDetails
          ticket={modal.ticket}
          responsibles={data.responsibles}
          onClose={close}
          onEdit={(ticket) => open({ kind: "edit", ticket })}
          onCloseTicket={(ticket) => open({ kind: "close", ticket })}
        />
      )}
      {(modal?.kind === "delete" || modal?.kind === "close") && (
        <Modal
          isOpen
          title="Confirmar ação"
          busy={busy}
          onClose={close}
          footer={
            <>
              <Button
                variant="secondary"
                disabled={busy}
                autoFocus
                onClick={close}
              >
                Cancelar
              </Button>
              <Button
                variant={modal.kind === "delete" ? "danger" : "primary"}
                disabled={busy}
                onClick={() =>
                  void (modal.kind === "delete"
                    ? mutate(
                        () => deleteTicket(modal.ticket.id),
                        "Chamado excluído com sucesso!",
                      )
                    : mutate(
                        () =>
                          updateTicket(modal.ticket.id, { status: "CLOSED" }),
                        "Chamado fechado com sucesso!",
                      ))
                }
              >
                {busy
                  ? "Aguarde..."
                  : modal.kind === "delete"
                    ? "Sim, excluir"
                    : "Sim, fechar"}
              </Button>
            </>
          }
        >
          <div className="confirmation">
            <Icon name="warning" />
            <div>
              <h3>
                Tem certeza que deseja{" "}
                {modal.kind === "delete" ? "excluir" : "fechar"} este chamado?
              </h3>
              <p className="confirmation-title">{modal.ticket.title}</p>
              <p>
                {modal.kind === "delete"
                  ? "Esta ação não poderá ser desfeita."
                  : "O chamado passará para o status Fechado."}
              </p>
            </div>
          </div>
          {formError && (
            <p role="alert" className="form-error">
              {formError}
            </p>
          )}
        </Modal>
      )}
      <Toast message={toast} onClose={dismissToast} />
    </>
  );
}
export default App;
