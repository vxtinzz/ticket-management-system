import { useEffect } from "react";
import { Icon } from "./Icon";
export interface ToastMessage {
  id: number;
  kind: "success" | "error";
  title: string;
  description?: string;
}
export function Toast({
  message,
  onClose,
}: {
  message: ToastMessage | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!message || message.kind === "error") return;
    const timer = window.setTimeout(onClose, 7000);
    return () => clearTimeout(timer);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div
      className={`toast toast-${message.kind}`}
      role={message.kind === "error" ? "alert" : "status"}
    >
      <Icon name={message.kind} />
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>
      <button aria-label="Dispensar notificação" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
