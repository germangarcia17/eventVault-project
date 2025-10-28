import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, ArrowLeft, Users } from 'lucide-react';
import { mockEvents } from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { gsap } from 'gsap';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import styles from './EventDetail.module.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCategoryClass = (category) => {
    const classes = {
      music: styles.badgeMusic,
      sports: styles.badgeSports,
      arts: styles.badgeArts,
      tech: styles.badgeTech,
      food: styles.badgeFood,
      workshop: styles.badgeWorkshop,
    };
    return classes[category] || styles.badgeMusic;
  };

  useEffect(() => {
    const foundEvent = mockEvents.find((e) => e.id === id);
    setEvent(foundEvent || null);

    if (foundEvent) {
      gsap.fromTo(
        '.event-detail',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [id]);

  const handleReserve = async () => {
    if (!user) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para reservar',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setLoading(true);
    // Simulate booking process
    setTimeout(() => {
      setLoading(false);
      toast({
        title: '¡Reserva exitosa!',
        description: 'Redirigiendo al pago...',
      });
      // In real app, this would redirect to Stripe Checkout
      navigate('/success');
    }, 1500);
  };

  if (!event) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundText}>Evento no encontrado</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.eventDetail}>
        <button
          onClick={() => navigate('/')}
          className={styles.backButton}
        >
          <ArrowLeft />
          Volver a eventos
        </button>

        <div className={styles.grid}>
          {/* Image */}
          <div className={styles.imageWrapper}>
            <img
              src={event.image_url}
              alt={event.title}
              className={styles.image}
            />
          </div>

          {/* Details */}
          <div className={styles.details}>
            <div className={styles.header}>
              <span className={`${styles.badge} ${getCategoryClass(event.category)}`}>
                {event.category}
              </span>
              <h1 className={styles.title}>
                {event.title}
              </h1>
              <p className={styles.description}>
                {event.description}
              </p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoItem}>
                <Calendar className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Fecha y hora</p>
                  <p className={styles.infoValue}>
                    {format(new Date(event.date), "d 'de' MMMM, yyyy - HH:mm", { locale: es })}
                  </p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <MapPin className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Ubicación</p>
                  <p className={styles.infoValue}>{event.location}</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Tag className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Precio</p>
                  <p className={styles.price}>${event.price}</p>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.reserveButton}
                onClick={handleReserve}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Reservar Entrada'}
              </button>
              <p className={styles.secureNote}>
                <Users />
                Pago seguro con Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
