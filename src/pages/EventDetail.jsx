import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, ArrowLeft, Users, Clock, Ticket } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { gsap } from 'gsap';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import styles from './EventDetail.module.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [hasReservation, setHasReservation] = useState(false);

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
    fetchEvent();
    if (user) {
      checkExistingReservation();
    }
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      setLoadingEvent(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setEvent(data);
      
      // Track event view
      if (data) {
        analytics.trackEventView(data.id, data.title);
      }

      // Animate after DOM is ready
      if (data) {
        setTimeout(() => {
          const element = document.querySelector('.event-detail');
          if (element) {
            gsap.fromTo(
              element,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
          }
        }, 50);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setEvent(null);
    } finally {
      setLoadingEvent(false);
    }
  };

  const checkExistingReservation = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', id)
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (error) {
        console.error('Error checking reservation:', error);
        setHasReservation(false);
        return;
      }

      setHasReservation(!!data);
    } catch (error) {
      console.error('Error checking reservation:', error);
      setHasReservation(false);
    }
  };

  const handleReserve = async () => {
    if (!user) {
      analytics.trackCTAClick('Reservar (Not Logged In)', event.title);
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para reservar',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (hasReservation) {
      toast({
        title: 'Ya tienes una reserva',
        description: 'Ya has reservado este evento',
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }

    // Track booking initiated
    analytics.trackBookingInitiated(event.id, event.title, Number(event.price) || 0);

    try {
      setLoading(true);

      // Generate temporary unique QR code (will be replaced with final one after payment)
      const tempQrCode = `TEMP-${user.id}-${id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create reservation in Supabase with temporary QR
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          user_id: user.id,
          event_id: id,
          payment_status: 'pending',
          qr_code: tempQrCode // Temporary unique QR code
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: '¡Reserva confirmada!',
        description: 'Ahora puedes proceder con el pago',
      });

      // Update local state
      setHasReservation(true);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: 'Error',
        description: 'No se pudo completar la reserva. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className={styles.loading}>
        <p className={styles.loadingText}>Cargando evento...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundText}>Evento no encontrado</p>
        <button 
          onClick={() => navigate('/events')} 
          className={styles.backButton}
        >
          <ArrowLeft />
          Ver todos los eventos
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.eventDetail}>
        <button
          onClick={() => navigate('/', { state: { fromInternal: true } })}
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
              <div className={styles.badgeGroup}>
                <span className={`${styles.badge} ${getCategoryClass(event.category)}`}>
                  {event.category}
                </span>
                <span className={styles.badgeDate}>
                  <Clock size={14} />
                  {format(new Date(event.date), "d MMM yyyy", { locale: es })}
                </span>
              </div>
              <h1 className={styles.title}>
                {event.title}
              </h1>
              <p className={styles.description}>
                {event.description}
              </p>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>
                <Ticket size={20} />
                Detalles del Evento
              </h3>
              
              <div className={styles.infoItem}>
                <Calendar className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Fecha y hora</p>
                  <p className={styles.infoValue}>
                    {format(new Date(event.date), "EEEE, d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                  <p className={styles.infoSubValue}>
                    {format(new Date(event.date), "HH:mm", { locale: es })} hrs
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
                  <p className={styles.infoLabel}>Precio por entrada</p>
                  <p className={styles.price}>${event.price} USD</p>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              {hasReservation ? (
                <>
                  <button
                    className={`${styles.reserveButton} ${styles.reserveButtonDisabled}`}
                    disabled
                  >
                    Ya tienes una reserva
                  </button>
                  <button
                    className={styles.viewReservationButton}
                    onClick={() => navigate('/dashboard')}
                  >
                    Ver mis reservas
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
