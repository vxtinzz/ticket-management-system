import type { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar, type SidebarItem } from "./Sidebar";
export function AppLayout({
  children,
  activeItem,
}: {
  children: ReactNode;
  activeItem: SidebarItem;
}) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <Sidebar activeItem={activeItem} />
      <div className="app-body">
        <Header />
        <main id="main-content" className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}