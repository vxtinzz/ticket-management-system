import { Badge } from "../ui/Badge";
import { statuses, priorities } from "../../utils/tickets";
import type { TicketStatus, Priority } from "../../types/ticket";

const statusVariants = {
  OPEN: "open",
  IN_PROGRESS: "inProgress",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

const priorityVariants = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export function StatusBadge({ value }: { value: TicketStatus }) {
  return <Badge variant={statusVariants[value]}>{statuses[value]}</Badge>;
}

export function PriorityBadge({ value }: { value: Priority }) {
  return <Badge variant={priorityVariants[value]}>{priorities[value]}</Badge>;
}
