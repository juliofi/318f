import { Link, useLocation, Outlet } from "react-router-dom";
import { FiBarChart2, FiUsers, FiMessageCircle, FiCpu, FiSettings } from "react-icons/fi";
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
            <FiBarChart2 className={styles.navIcon} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/crm"
            className={`${styles.navLink} ${isActive("/crm") ? styles.navLinkActive : ""}`}
          >
            <FiUsers className={styles.navIcon} />
            <span>CRM</span>
          </Link>
          <Link
            to="/chat"
            className={`${styles.navLink} ${isActive("/chat") ? styles.navLinkActive : ""}`}
          >
            <FiMessageCircle className={styles.navIcon} />
            <span>Chat</span>
          </Link>
          <Link
            to="/agents"
            className={`${styles.navLink} ${isActive("/agents") ? styles.navLinkActive : ""}`}
          >
            <FiCpu className={styles.navIcon} />
            <span>Agentes IA</span>
          </Link>
          <Link
            to="/settings"
            className={`${styles.navLink} ${isActive("/settings") ? styles.navLinkActive : ""}`}
          >
            <FiSettings className={styles.navIcon} />
            <span>Configurações</span>
          </Link>
        </nav>
      </aside>

      <main className={styles.content}>
        <section className={styles.page}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
