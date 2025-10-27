import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { EventCard } from '@/components/EventCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockEvents } from '@/lib/mockData';
import { Event } from '@/types';
import { gsap } from 'gsap';
import heroImage from '@/assets/hero-events.jpg';

const Home = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    // Animate hero section on mount
    gsap.fromTo(
      '.hero-content',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    // Animate event cards
    gsap.fromTo(
      '.event-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3, ease: 'power2.out' }
    );
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative -mx-4 -mt-8 mb-12 overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <img
          src={heroImage}
          alt="Events hero"
          className="absolute inset-0 h-full w-full object-cover mix-blend-overlay"
        />
        <div className="hero-content relative z-10 px-4 py-24 text-center text-white">
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">
            Descubre Eventos Increíbles
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl opacity-95">
            Encuentra y reserva entradas para los mejores conciertos, deportes, arte y más
          </p>
          <Button variant="hero" size="lg">
            Explorar Eventos
          </Button>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="music">Música</SelectItem>
                <SelectItem value="sports">Deportes</SelectItem>
                <SelectItem value="arts">Arte</SelectItem>
                <SelectItem value="tech">Tecnología</SelectItem>
                <SelectItem value="food">Gastronomía</SelectItem>
                <SelectItem value="workshop">Talleres</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
        </p>
      </section>

      {/* Events Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="event-card">
            <EventCard event={event} />
          </div>
        ))}
      </section>

      {filteredEvents.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">
            No se encontraron eventos con esos criterios
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
