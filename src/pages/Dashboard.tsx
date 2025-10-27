import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Download, Ticket } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reservation } from '@/types';
import { mockEvents } from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { gsap } from 'gsap';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }

    // Mock reservations - in real app, fetch from Supabase
    if (user) {
      const mockReservations: Reservation[] = [
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

  const downloadQR = (qrCode: string, eventTitle: string) => {
    const canvas = document.querySelector(`#qr-${qrCode}`) as HTMLCanvasElement;
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Mis Reservas</h1>
          <p className="text-muted-foreground">
            Gestiona tus entradas y códigos QR para eventos
          </p>
        </div>
        <Ticket className="h-12 w-12 text-primary" />
      </div>

      {reservations.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-4">
              No tienes reservas todavía
            </p>
            <Button variant="default" onClick={() => navigate('/')}>
              Explorar Eventos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="reservation-card shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {reservation.event?.title}
                    </CardTitle>
                    <CardDescription className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {reservation.event &&
                            format(
                              new Date(reservation.event.date),
                              "d 'de' MMMM, yyyy",
                              { locale: es }
                            )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{reservation.event?.location}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <Badge
                    className={
                      reservation.payment_status === 'paid'
                        ? 'bg-green-500/10 text-green-700 border-green-200'
                        : 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
                    }
                  >
                    {reservation.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-3 rounded-lg border border-border bg-muted/30 p-6">
                  <p className="text-sm font-medium text-muted-foreground">
                    Tu código QR de entrada
                  </p>
                  <div className="rounded-lg bg-white p-4">
                    <QRCodeSVG
                      id={`qr-${reservation.qr_code}`}
                      value={reservation.qr_code}
                      size={180}
                      level="H"
                      includeMargin
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Muestra este código en el evento
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    downloadQR(reservation.qr_code, reservation.event?.title || 'ticket')
                  }
                >
                  <Download className="h-4 w-4" />
                  Descargar QR
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
