import { Link, useLocation, Outlet } from "react-router-dom";
import styles from "./styles.module.css";

export default function AppLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Link to="/dashboard" className={styles.logoLink}>
          <h1 className={styles.logo}>uHunter</h1>
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/dashboard"
            className={`${styles.navLink} ${isActive("/dashboard") ? styles.navLinkActive : ""}`}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/crm"
            className={`${styles.navLink} ${isActive("/crm") ? styles.navLinkActive : ""}`}
          >
            👥 CRM
          </Link>
          <Link
            to="/chat"
            className={`${styles.navLink} ${isActive("/chat") ? styles.navLinkActive : ""}`}
          >
            💬 Chat
          </Link>
          <Link
            to="/agents"
            className={`${styles.navLink} ${isActive("/agents") ? styles.navLinkActive : ""}`}
          >
            🤖 Agentes IA
          </Link>
          <Link
            to="/settings"
            className={`${styles.navLink} ${isActive("/settings") ? styles.navLinkActive : ""}`}
          >
            ⚙️ Configurações
          </Link>
        </nav>
      </aside>

      <main className={styles.content}>
        <header className={styles.header}>
          <p className={styles.welcomeText}>Bem-vindo(a), Julio 👋</p>
        </header>

        <section className={styles.page}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
