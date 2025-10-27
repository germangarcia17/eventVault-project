import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockEvents } from '@/lib/mockData';
import { Event } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { gsap } from 'gsap';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const categoryColors: Record<string, string> = {
  music: 'bg-purple-500/10 text-purple-700 border-purple-200',
  sports: 'bg-blue-500/10 text-blue-700 border-blue-200',
  arts: 'bg-pink-500/10 text-pink-700 border-pink-200',
  tech: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
  food: 'bg-orange-500/10 text-orange-700 border-orange-200',
  workshop: 'bg-green-500/10 text-green-700 border-green-200',
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">Evento no encontrado</p>
      </div>
    );
  }

  return (
    <div className="event-detail space-y-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a eventos
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl">
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <Badge className={`mb-3 ${categoryColors[event.category]}`}>
              {event.category}
            </Badge>
            <h1 className="mb-4 text-4xl font-bold text-foreground">
              {event.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-6">
            <div className="flex items-center gap-3 text-foreground">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Fecha y hora</p>
                <p className="font-semibold">
                  {format(new Date(event.date), "d 'de' MMMM, yyyy - HH:mm", { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Ubicación</p>
                <p className="font-semibold">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-foreground">
              <Tag className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Precio</p>
                <p className="text-3xl font-bold text-primary">${event.price}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleReserve}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Reservar Entrada'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Users className="inline h-4 w-4 mr-1" />
              Pago seguro con Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
