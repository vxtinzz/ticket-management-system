export function Header({
  userName = "Administrador",
  companyName = "Codificar",
}: {
  userName?: string;
  companyName?: string;
}) {
  return (
    <header className="app-header">
      <div className="profile">
        <span className="avatar">{userName.charAt(0).toUpperCase()}</span>
        <div>
          <p className="font-medium">{userName}</p>
          <small className="font-normal">{companyName}</small>
        </div>
      </div>
    </header>
  );
}
