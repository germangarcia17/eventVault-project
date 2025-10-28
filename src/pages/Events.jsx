import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { EventCard } from '@/components/EventCard';
import { mockEvents } from '@/lib/mockData';
import { gsap } from 'gsap';
import heroImage from '@/assets/hero-events.jpg';
import styles from './Events.module.css';

const Events = () => {
  const [events, setEvents] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

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
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground} />
        <img
          src={heroImage}
          alt="Events hero"
          className={styles.heroImage}
        />
        <div className={`${styles.heroContent} hero-content`}>
          <h1 className={styles.heroTitle}>
            Descubre Eventos Increíbles
          </h1>
          <p className={styles.heroDescription}>
            Encuentra y reserva entradas para los mejores conciertos, deportes, arte y más
          </p>
          <button className={styles.heroButton}>
            Explorar Eventos
          </button>
        </div>
      </section>

      {/* Search and Filters */}
      <section className={styles.filtersSection}>
        <div className={styles.filtersRow}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <Filter className={styles.filterIcon} />
            <div className={styles.selectWrapper}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={styles.select}
              >
                <option value="all">Todas</option>
                <option value="music">Música</option>
                <option value="sports">Deportes</option>
                <option value="arts">Arte</option>
                <option value="tech">Tecnología</option>
                <option value="food">Gastronomía</option>
                <option value="workshop">Talleres</option>
              </select>
              <ChevronDown className={styles.selectArrow} />
            </div>
          </div>
        </div>

        <p className={styles.resultsCount}>
          {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
        </p>
      </section>

      {/* Events Grid */}
      <section className={styles.eventsGrid}>
        {filteredEvents.map((event) => (
          <div key={event.id} className={`${styles.eventCardWrapper} event-card`}>
            <EventCard event={event} />
          </div>
        ))}
      </section>

      {filteredEvents.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateText}>
            No se encontraron eventos con esos criterios
          </p>
        </div>
      )}
    </div>
  );
};

export default Events;
