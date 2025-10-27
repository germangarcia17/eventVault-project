import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
}

const categoryColors: Record<string, string> = {
  music: 'bg-purple-500/10 text-purple-700 border-purple-200',
  sports: 'bg-blue-500/10 text-blue-700 border-blue-200',
  arts: 'bg-pink-500/10 text-pink-700 border-pink-200',
  tech: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
  food: 'bg-orange-500/10 text-orange-700 border-orange-200',
  workshop: 'bg-green-500/10 text-green-700 border-green-200',
};

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-glow hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <Badge className={`absolute top-3 right-3 ${categoryColors[event.category]}`}>
          {event.category}
        </Badge>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(new Date(event.date), "d 'de' MMMM, yyyy - HH:mm", { locale: es })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold text-primary">${event.price}</span>
          </div>
          <Link to={`/event/${event.id}`}>
            <Button variant="default" size="sm">
              Ver Detalles
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
};
