import type { ReactNode } from "react";
type BadgeVariant =
  | "low"
  | "medium"
  | "high"
  | "open"
  | "inProgress"
  | "resolved"
  | "closed"
  | "default";
  
export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: BadgeVariant;
}) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
