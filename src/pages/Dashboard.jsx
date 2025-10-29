import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Download, Ticket, CreditCard, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { gsap } from 'gsap';
import { analytics } from '@/lib/analytics';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [activeTab, setActiveTab] = useState('reservations'); // 'reservations' or 'payments'

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }

    if (user) {
      fetchReservations();
    }
  }, [user, loading, navigate]);

  // Update tab if location state changes
  useEffect(() => {
    if (location.state?.activeTab) {
      const tab = location.state.activeTab;
      setActiveTab(tab);
      analytics.trackDashboardView(tab);
      // Clear the location state after reading it
      window.history.replaceState({}, document.title);
    } else {
      analytics.trackDashboardView(activeTab);
    }
  }, [location.state]);

  const fetchReservations = async () => {
    try {
      setLoadingReservations(true);
      
      // Fetch reservations with their associated events
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          events(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match the expected format
      const formattedReservations = (data || []).map(reservation => ({
        ...reservation,
        event: reservation.events
      }));

      setReservations(formattedReservations);

      // Animate cards after data is loaded
      if (formattedReservations && formattedReservations.length > 0) {
        setTimeout(() => {
          gsap.fromTo(
            '.reservation-card',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
          );
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoadingReservations(false);
    }
  };

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

  const handlePayment = (reservation) => {
    // Navigate to payment page with reservation and event data
    navigate('/payment', { 
      state: { 
        reservation: reservation,
        event: reservation.event
      } 
    });
  };

  // Filter reservations by status
  const pendingReservations = reservations.filter(r => r.payment_status === 'pending');
  const paidReservations = reservations.filter(r => r.payment_status === 'paid');

  if (loading || loadingReservations) {
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
          <h1>Mi Dashboard</h1>
          <p>
            Gestiona tus reservas y entradas
          </p>
        </div>
        <Ticket className={styles.ticketIcon} />
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'reservations' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          <Clock size={18} />
          Reservas Pendientes
          {pendingReservations.length > 0 && (
            <span className={styles.tabBadge}>{pendingReservations.length}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'payments' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <CreditCard size={18} />
          Pagadas
          {paidReservations.length > 0 && (
            <span className={styles.tabBadge}>{paidReservations.length}</span>
          )}
        </button>
      </div>

      {reservations.length === 0 ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyContent}>
            <Ticket className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              No tienes reservas todavía
            </p>
            <button className={styles.exploreButton} onClick={() => navigate('/events')}>
              Explorar Eventos
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {/* Reservations Tab - Pending Payments */}
          {activeTab === 'reservations' && (
            <>
              {pendingReservations.length === 0 ? (
                <div className={styles.emptyCard}>
                  <div className={styles.emptyContent}>
                    <Clock className={styles.emptyIcon} />
                    <p className={styles.emptyText}>
                      No tienes reservas pendientes
                    </p>
                    <button className={styles.exploreButton} onClick={() => navigate('/events')}>
                      Explorar Eventos
                    </button>
                  </div>
                </div>
              ) : (
                pendingReservations.map((reservation) => (
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
                        <span className={`${styles.badge} ${styles.badgePending}`}>
                          Pendiente
                        </span>
                      </div>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.priceSection}>
                        <p className={styles.priceLabel}>Precio</p>
                        <p className={styles.priceAmount}>${reservation.event?.price} USD</p>
                      </div>
                      <button
                        className={styles.payButton}
                        onClick={() => handlePayment(reservation)}
                      >
                        <CreditCard />
                        Proceder al Pago
                      </button>
                      <p className={styles.payNote}>
                        Pago seguro con Stripe
                      </p>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* Payments Tab - Paid Reservations */}
          {activeTab === 'payments' && (
            <>
              {paidReservations.length === 0 ? (
                <div className={styles.emptyCard}>
                  <div className={styles.emptyContent}>
                    <CreditCard className={styles.emptyIcon} />
                    <p className={styles.emptyText}>
                      No tienes entradas pagadas aún
                    </p>
                    <button className={styles.exploreButton} onClick={() => setActiveTab('reservations')}>
                      Ver Reservas Pendientes
                    </button>
                  </div>
                </div>
              ) : (
                paidReservations.map((reservation) => (
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
                        <span className={`${styles.badge} ${styles.badgePaid}`}>
                          Pagado
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
                ))
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
