import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react";
import { gsap } from "gsap";
import styles from './NotFound.module.css';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    gsap.fromTo(
      '.error-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, [location.pathname]);

  return (
    <div className={styles.container}>
      <div className={`${styles.card} error-card`}>
        <div className={styles.cardHeader}>
          <div className={styles.iconWrapper}>
            <AlertCircle className={styles.icon} />
          </div>
          <h1 className={styles.errorCode}>404</h1>
          <p className={styles.description}>
            We can't seem to find the page you're looking for.
          </p>
        </div>
        <div className={styles.cardContent}>
          <p className={styles.message}>
            The page you're looking for is not available or has been moved.
          </p>
          <button className={styles.button} onClick={() => navigate('/', { state: { fromInternal: true } })}>
            <Home />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
