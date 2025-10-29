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
            ¡Reserva Confirmada!
          </h1>
          <p className={styles.description}>
            Tu pago ha sido procesado exitosamente
          </p>
        </div>
        <div className={styles.cardContent}>
          <p className={styles.message}>
            Hemos enviado tu entrada y código QR a tu email. También puedes verlo en tu panel de
            reservas.
          </p>
          <div className={styles.actions}>
            <button className={styles.button} onClick={() => navigate('/dashboard')}>
              Ver Mis Reservas
            </button>
            <button className={`${styles.button} ${styles.buttonOutline}`} onClick={() => navigate('/', { state: { fromInternal: true } })}>
              Explorar Más Eventos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
