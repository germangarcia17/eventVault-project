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
          <h1 className={styles.title}>Pago Cancelado</h1>
          <p className={styles.description}>
            Tu reserva no se ha completado
          </p>
        </div>
        <div className={styles.cardContent}>
          <p className={styles.message}>
            No se realizó ningún cargo. Puedes intentar reservar nuevamente cuando estés listo.
          </p>
          <div className={styles.actions}>
            <button className={styles.button} onClick={() => navigate(-1)}>
              Volver al Evento
            </button>
            <button className={`${styles.button} ${styles.buttonOutline}`} onClick={() => navigate('/', { state: { fromInternal: true } })}>
              Ver Todos los Eventos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
