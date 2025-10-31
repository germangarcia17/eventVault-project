import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { gsap } from 'gsap';
import styles from './Cancel.module.css';

const Cancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      '.cancel-card',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  }, []);

  return (
    <div className={styles.container}>
      <div className={`${styles.card} cancel-card`}>
        <div className={styles.cardHeader}>
          <div className={styles.iconWrapper}>
            <XCircle className={styles.icon} />
          </div>
          <h1 className={styles.title}>Payment Cancelled</h1>
          <p className={styles.description}>
            Your reservation has not been completed
          </p>
        </div>
        <div className={styles.cardContent}>
          <p className={styles.message}>
            No charge was made. You can try to reserve again when you are ready.
          </p>
          <div className={styles.actions}>
            <button className={styles.button} onClick={() => navigate(-1)}>
              Back to Event
            </button>
            <button className={`${styles.button} ${styles.buttonOutline}`} onClick={() => navigate('/', { state: { fromInternal: true } })}>
              View All Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
