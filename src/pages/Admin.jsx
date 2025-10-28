import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Calendar } from 'lucide-react';
import styles from './Admin.module.css';

const Admin = () => {
  return (
    <div className={styles.adminLayout}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Panel de Administración</h1>
          <p>Gestiona los eventos y visualiza estadísticas</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className={styles.tabsNav}>
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.tabActive : ''}`
          }
        >
          <BarChart3 size={20} />
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/events"
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.tabActive : ''}`
          }
        >
          <Calendar size={20} />
          Gestión de Eventos
        </NavLink>
      </nav>

      {/* Nested Routes Content */}
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
