import { Link, useLocation } from 'react-router-dom';
import { Calendar, LogOut, User, Ticket } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import styles from './Layout.module.css';

export const Layout = ({ children }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIconWrapper}>
              <Ticket className={styles.logoIcon} />
            </div>
            <span className={styles.logoText}>
              EventVault
            </span>
          </Link>

          <nav className={styles.nav}>
            <Link
              to="/"
              className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}
            >
              Inicio
            </Link>
            <Link
              to="/events"
              className={`${styles.navLink} ${isActive('/events') ? styles.navLinkActive : ''}`}
            >
              Eventos
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`${styles.navLink} ${styles.navLinkHidden} ${isActive('/dashboard') ? styles.navLinkActive : ''}`}
                >
                  Mis Reservas
                </Link>
                <button 
                  className={styles.logoutButton}
                  onClick={signOut}
                >
                  <LogOut className={styles.logoutIcon} />
                  <span className={styles.logoutText}>Salir</span>
                </button>
              </>
            ) : (
              <Link to="/auth" className={styles.loginButton}>
                <User className={styles.loginIcon} />
                <span className={styles.loginTextFull}>Iniciar Sesión</span>
                <span className={styles.loginTextShort}>Login</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerSection}>
              <div className={styles.footerLogo}>
                <div className={styles.footerLogoIconWrapper}>
                  <Ticket className={styles.footerLogoIcon} />
                </div>
                <span className={styles.footerLogoText}>
                  EventVault
                </span>
              </div>
              <p className={styles.footerDescription}>
                Las mejores experiencias en vivo
              </p>
            </div>
            
            <div className={styles.footerSection}>
              <h3 className={styles.footerTitle}>Enlaces Rápidos</h3>
              <ul className={styles.footerLinks}>
                <li><Link to="/" className={styles.footerLink}>Inicio</Link></li>
                <li><Link to="/events" className={styles.footerLink}>Eventos</Link></li>
                <li><Link to="/auth" className={styles.footerLink}>Iniciar Sesión</Link></li>
              </ul>
            </div>
            
            <div className={styles.footerSection}>
              <h3 className={styles.footerTitle}>Contacto</h3>
              <p className={styles.footerContact}>
                © 2025 EventVault
                <br />
                Portfolio Project
              </p>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <p className={styles.footerCopyright}>
              Built with React • TypeScript • TailwindCSS • Supabase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
