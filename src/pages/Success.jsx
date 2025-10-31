import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { gsap } from 'gsap';
import styles from './Success.module.css';

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      '.success-card',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  }, []);

  return (
    <div className={styles.container}>
      <div className={`${styles.card} success-card`}>
        <div className={styles.cardHeader}>
          <div className={styles.iconWrapper}>
            <CheckCircle className={styles.icon} />
          </div>
          <h1 className={styles.title}>
            ¡Reservation Confirmed!
          </h1>
          <p className={styles.description}>
            Your ticket has been successfully booked.
          </p>
        </div>
        <div className={styles.cardContent}>
          <p className={styles.message}>
            We have sent your ticket and QR code to your email. You can also view it in your dashboard.
          </p>
          <div className={styles.actions}>
            <button className={styles.button} onClick={() => navigate('/dashboard')}>
              View My Reservations
            </button>
            <button className={`${styles.button} ${styles.buttonOutline}`} onClick={() => navigate('/', { state: { fromInternal: true } })}>
              Explore More Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
