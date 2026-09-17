import { Icon } from "../ui/Icon";
export type SidebarItem = "home" | "tickets" | "responsibles";
export function Sidebar({
  activeItem = "tickets",
}: {
  activeItem?: SidebarItem;
}) {
  const items = [
    { id: "home", label: "Dashboard", icon: "home" },
    { id: "tickets", label: "Chamados", icon: "tickets" },
    { id: "responsibles", label: "Responsáveis", icon: "responsibles" },
  ] as const;
  return (
    <aside className="sidebar">
      <a href="#/home" className="brand" aria-label="Codificar — Dashboard">
        <span>C</span>
        <strong>Codificar</strong>
      </a>
      <nav aria-label="Navegação principal">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#/${item.id}`}
            aria-current={activeItem === item.id ? "page" : undefined}
            className={activeItem === item.id ? "active" : ""}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
