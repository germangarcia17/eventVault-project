import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import styles from './EventCard.module.css';

const categoryStyles = {
  music: styles.badgeMusic,
  sports: styles.badgeSports,
  arts: styles.badgeArts,
  tech: styles.badgeTech,
  food: styles.badgeFood,
  workshop: styles.badgeWorkshop,
};

export const EventCard = ({ event }) => {
  return (
    <article className={styles.card}>
      {/* Hover glow effect */}
      <div className={styles.hoverGlow} />
      
      <div className={styles.imageWrapper}>
        <img
          src={event.image_url}
          alt={event.title}
          className={styles.image}
        />
        <div className={styles.imageOverlay} />
        <div className={`${styles.badge} ${categoryStyles[event.category]}`}>
          {event.category}
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>
          {event.title}
        </h3>

        <p className={styles.description}>
          {event.description}
        </p>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <Calendar className={styles.detailIcon} />
            <span className={styles.detailText}>
              {format(new Date(event.date), "MMMM d, yyyy", { locale: enUS })}
            </span>
          </div>
          <div className={styles.detailRow}>
            <MapPin className={styles.detailIcon} />
            <span className={styles.detailLocation}>{event.location}</span>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            <Tag className={styles.priceIcon} />
            <span className={styles.priceAmount}>${event.price}</span>
          </div>
          <Link to={`/event/${event.id}`} className={styles.button}>
            Browse more
          </Link>
        </div>
      </div>
    </article>
  );
};
