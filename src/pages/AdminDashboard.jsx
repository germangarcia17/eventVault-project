import { useState, useEffect } from 'react';
import { Users, CreditCard, TrendingUp, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalReservations: 0,
    paidReservations: 0,
    pendingReservations: 0,
    totalRevenue: 0,
    eventStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching reservations...');
      
      // IMPORTANTE: Necesitas configurar RLS en Supabase para que los admins puedan ver todas las reservas
      // Por ahora, intenta obtener datos sin restricciones
      
      // Primero, intenta con una consulta simple
      let query = supabase
        .from('reservations')
        .select('*');
      
      // Si necesitas bypass RLS, descomentar esta línea (requiere service_role key):
      // const { data: reservations, error: reservationsError } = await supabase.auth.admin.listUsers()
      
      const { data: reservations, error: reservationsError, count } = await query;

      console.log('Supabase response:', { 
        reservations, 
        error: reservationsError,
        count,
        reservationsLength: reservations?.length 
      });

      if (reservationsError) {
        console.error('Supabase error:', reservationsError);
        
        // Si el error es por RLS, mostrar mensaje específico
        if (reservationsError.code === 'PGRST116' || reservationsError.message?.includes('row-level security')) {
          toast({
            title: 'Error de permisos',
            description: 'Necesitas configurar las políticas RLS en Supabase para ver las reservas como admin',
            variant: 'destructive'
          });
        }
        
        throw reservationsError;
      }

      if (!reservations || reservations.length === 0) {
        console.warn('⚠️ No reservations found. Possible reasons:');
        console.warn('1. No hay reservas en la base de datos');
        console.warn('2. RLS (Row Level Security) está bloqueando el acceso');
        console.warn('3. El usuario actual no tiene permisos para ver las reservas');
        
        toast({
          title: 'Sin datos',
          description: 'No se encontraron reservas. Verifica las políticas de seguridad en Supabase.',
          variant: 'destructive'
        });
        
        setStats({
          totalReservations: 0,
          paidReservations: 0,
          pendingReservations: 0,
          totalRevenue: 0,
          eventStats: []
        });
        setLoading(false);
        return;
      }

      console.log('✅ Reservations data:', reservations);
      console.log('📊 Number of reservations:', reservations.length);

      // Fetch events separately
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*');

      console.log('Events data:', events);

      if (eventsError) throw eventsError;

      // Create events map for easier lookup
      const eventsMap = {};
      events?.forEach(event => {
        eventsMap[event.id] = event;
      });

      // Calculate stats
      const totalReservationsCount = reservations?.length || 0;
      
      // Unique users with any reservation
      const uniqueUsersWithReservations = new Set(reservations?.map(r => r.user_id) || []).size;
      
      // Reservas pagadas y usuarios únicos que han pagado
      const paidReservationsList = reservations?.filter(r => r.payment_status === 'paid' || r.payment_status === 'completed') || [];
      const paidReservationsCount = paidReservationsList.length;
      const uniqueUsersWithPayments = new Set(paidReservationsList.map(r => r.user_id)).size;
      
      // Reservas pendientes
      const pendingReservationsList = reservations?.filter(r => r.payment_status === 'pending' || !r.payment_status) || [];
      const pendingReservationsCount = pendingReservationsList.length;
      
      // Calculate revenue
      const totalRevenue = paidReservationsList.reduce((sum, r) => {
        const event = eventsMap[r.event_id];
        return sum + (event?.price || 0);
      }, 0);

      console.log('📈 Calculated stats:', { 
        totalReservationsCount,
        uniqueUsersWithReservations, 
        paidReservationsCount,
        uniqueUsersWithPayments, 
        pendingReservationsCount, 
        totalRevenue 
      });

      // Calculate per-event stats
      const eventStatsMap = {};
      reservations?.forEach(reservation => {
        const eventId = reservation.event_id;
        const event = eventsMap[eventId];
        
        if (!eventStatsMap[eventId]) {
          eventStatsMap[eventId] = {
            eventId,
            eventTitle: event?.title || 'Unknown',
            eventPrice: event?.price || 0,
            totalReservations: 0,
            paidReservations: 0,
            pendingReservations: 0,
            revenue: 0
          };
        }
        
        eventStatsMap[eventId].totalReservations++;
        if (reservation.payment_status === 'paid' || reservation.payment_status === 'completed') {
          eventStatsMap[eventId].paidReservations++;
          eventStatsMap[eventId].revenue += event?.price || 0;
        } else {
          eventStatsMap[eventId].pendingReservations++;
        }
      });

      const eventStats = Object.values(eventStatsMap).sort((a, b) => b.totalReservations - a.totalReservations);

      console.log('Event stats:', eventStats);

      setStats({
        totalReservations: totalReservationsCount,     // Total de reservas (no usuarios únicos)
        paidReservations: paidReservationsCount,       // Total de reservas pagadas
        pendingReservations: pendingReservationsCount, // Total de reservas pendientes
        totalRevenue,
        eventStats
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las estadísticas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header with Refresh Button */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Estadísticas</h2>
          <p className={styles.subtitle}>Vista general del rendimiento</p>
        </div>
        <button 
          onClick={fetchStats} 
          className={styles.refreshButton}
          disabled={loading}
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
            <Users size={24} style={{ color: 'hsl(var(--primary))' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Reservas</p>
            <p className={styles.statValue}>{stats.totalReservations}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'hsl(142, 76%, 36% / 0.1)' }}>
            <CreditCard size={24} style={{ color: 'hsl(142, 76%, 36%)' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Reservas Pagadas</p>
            <p className={styles.statValue}>{stats.paidReservations}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'hsl(45, 93%, 47% / 0.1)' }}>
            <TrendingUp size={24} style={{ color: 'hsl(45, 93%, 47%)' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Reservas Pendientes</p>
            <p className={styles.statValue}>{stats.pendingReservations}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'hsl(262, 83%, 58% / 0.1)' }}>
            <DollarSign size={24} style={{ color: 'hsl(262, 83%, 58%)' }} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Ingresos Totales</p>
            <p className={styles.statValue}>€{stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Event Stats Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2>Estadísticas por Evento</h2>
          <p>Rendimiento detallado de cada evento</p>
        </div>
        <div className={styles.tableWrapper}>
          {stats.eventStats.length === 0 ? (
            <div className={styles.emptyState}>
              <Calendar size={48} />
              <p>No hay reservas registradas aún</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Precio</th>
                  <th>Total Reservas</th>
                  <th>Pagadas</th>
                  <th>Pendientes</th>
                  <th>Ingresos</th>
                  <th>Tasa Conversión</th>
                </tr>
              </thead>
              <tbody>
                {stats.eventStats.map((eventStat) => (
                  <tr key={eventStat.eventId}>
                    <td className={styles.eventNameCell}>{eventStat.eventTitle}</td>
                    <td>€{eventStat.eventPrice.toFixed(2)}</td>
                    <td>
                      <span className={styles.badge}>{eventStat.totalReservations}</span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                        {eventStat.paidReservations}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeWarning}`}>
                        {eventStat.pendingReservations}
                      </span>
                    </td>
                    <td className={styles.revenueCell}>€{eventStat.revenue.toFixed(2)}</td>
                    <td>
                      <div className={styles.conversionRate}>
                        {eventStat.totalReservations > 0
                          ? ((eventStat.paidReservations / eventStat.totalReservations) * 100).toFixed(1)
                          : 0}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
