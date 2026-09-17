type IconName =
  | "home"
  | "tickets"
  | "responsibles"
  | "edit"
  | "delete"
  | "search"
  | "close"
  | "success"
  | "error"
  | "warning";

const extensions: Partial<Record<IconName, string>> = { close: "svg", warning: "svg" };

export function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <img
      src={`src/assets/${name}.${extensions[name] ?? "png"}`}
      alt=""
      aria-hidden="true"
      className={`icon ${className}`}
      width="24"
      height="24"
    />
  );
}
