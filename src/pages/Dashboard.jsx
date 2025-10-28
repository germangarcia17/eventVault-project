import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Download, Ticket } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { mockEvents } from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { gsap } from 'gsap';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }

    // Mock reservations - in real app, fetch from Supabase
    if (user) {
      const mockReservations = [
        {
          id: '1',
          user_id: user.id,
          event_id: '1',
          payment_status: 'paid',
          qr_code: `RESERVATION-${user.id}-1`,
          created_at: new Date().toISOString(),
          event: mockEvents[0],
        },
        {
          id: '2',
          user_id: user.id,
          event_id: '3',
          payment_status: 'paid',
          qr_code: `RESERVATION-${user.id}-3`,
          created_at: new Date().toISOString(),
          event: mockEvents[2],
        },
      ];
      setReservations(mockReservations);

      gsap.fromTo(
        '.reservation-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [user, loading, navigate]);

  const downloadQR = (qrCode, eventTitle) => {
    const canvas = document.querySelector(`#qr-${qrCode}`);
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${eventTitle.replace(/\s+/g, '-')}-QR.png`;
      link.href = url;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p className={styles.loadingText}>Cargando...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Mis Reservas</h1>
          <p>
            Gestiona tus entradas y códigos QR para eventos
          </p>
        </div>
        <Ticket className={styles.ticketIcon} />
      </div>

      {reservations.length === 0 ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyContent}>
            <Ticket className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              No tienes reservas todavía
            </p>
            <button className={styles.exploreButton} onClick={() => navigate('/')}>
              Explorar Eventos
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {reservations.map((reservation) => (
            <div key={reservation.id} className={`${styles.card} reservation-card`}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderContent}>
                  <div className={styles.cardInfo}>
                    <h2 className={styles.cardTitle}>
                      {reservation.event?.title}
                    </h2>
                    <div className={styles.cardDetails}>
                      <div className={styles.cardDetail}>
                        <Calendar />
                        <span>
                          {reservation.event &&
                            format(
                              new Date(reservation.event.date),
                              "d 'de' MMMM, yyyy",
                              { locale: es }
                            )}
                        </span>
                      </div>
                      <div className={styles.cardDetail}>
                        <MapPin />
                        <span>{reservation.event?.location}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`${styles.badge} ${
                      reservation.payment_status === 'paid'
                        ? styles.badgePaid
                        : styles.badgePending
                    }`}
                  >
                    {reservation.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                  </span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.qrSection}>
                  <p className={styles.qrLabel}>
                    Tu código QR de entrada
                  </p>
                  <div className={styles.qrWrapper}>
                    <QRCodeSVG
                      id={`qr-${reservation.qr_code}`}
                      value={reservation.qr_code}
                      size={180}
                      level="H"
                      includeMargin
                    />
                  </div>
                  <p className={styles.qrNote}>
                    Muestra este código en el evento
                  </p>
                </div>
                <button
                  className={styles.downloadButton}
                  onClick={() =>
                    downloadQR(reservation.qr_code, reservation.event?.title || 'ticket')
                  }
                >
                  <Download />
                  Descargar QR
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
