import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { EventCard } from '@/components/EventCard';
import { mockEvents } from '@/lib/mockData';
import { gsap } from 'gsap';
import heroImage from '@/assets/hero-events.jpg';
import styles from './Home.module.css';

const Home = () => {
  useEffect(() => {
    // Dramatic entrance animations
    gsap.fromTo(
      '.hero-title',
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power4.out' }
    );

    gsap.fromTo(
      '.hero-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' }
    );

    gsap.fromTo(
      '.hero-cta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: 'power2.out' }
    );

    // Animate sections with stagger
    gsap.fromTo(
      '.fade-in-section',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, delay: 0.8, ease: 'power2.out' }
    );
  }, []);

  // Get the 4 upcoming events sorted by date
  const upcomingEvents = [...mockEvents]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  // Get the event with the closest deadline
  const urgentEvent = upcomingEvents[0];

  return (
    <div className={styles.container}>
      <div className={styles.sectionSpacing}>
        {/* Hero Section - Ultra dramatic inspired by thescotch.org */}
        <section className={styles.heroSection}>
          {/* Background with overlay */}
          <div className={styles.heroBackground} />
          <img
            src={heroImage}
            alt="Events hero"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
          
          {/* Animated light rays effect */}
          <div className={styles.heroLightRays} />
          
          <div className={styles.heroContent}>
            {/* Small badge */}
            <div className={`${styles.heroBadge} hero-subtitle`}>
              <Zap className={styles.heroBadgeIcon} fill="currentColor" />
              <span>Experiencias Épicas</span>
              <Zap className={styles.heroBadgeIcon} fill="currentColor" />
            </div>

            {/* Main dramatic title */}
            <h1 className={`${styles.heroTitle} hero-title`}>
              <span className={styles.heroTitleLine1}>
                ES AUTOMÁTICO
              </span>
              <span className={styles.heroTitleLine2}>
                ES SISTEMÁTICO
              </span>
              <span className={styles.heroTitleLine3}>
                ES HIDROMÁTICO
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`${styles.heroSubtitle} hero-subtitle`}>
              ¡Son los eventos más electrizantes!
            </p>

            {/* CTA Buttons */}
            <div className={`${styles.heroCta} hero-cta`}>
              <Link to="/events" className={styles.heroCtaButton}>
                Ver Eventos
                <ArrowRight className={styles.heroCtaButtonIcon} />
              </Link>
              <Link to="/auth" className={styles.heroCtaSecondary}>
                Iniciar Sesión
              </Link>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className={styles.heroBottomGradient} />
        </section>

        {/* Separator line with glow */}
        <div className={styles.separator}>
          <div className={styles.separatorLine} />
        </div>

        {/* Upcoming Events - Dramatic presentation */}
        <section className={`${styles.eventsSection} ${styles.fadeInSection} fade-in-section`}>
          <div className={styles.eventsSectionHeader}>
            <div className={styles.eventsSectionBadge}>
              <Sparkles className={styles.eventsSectionBadgeIcon} />
              <span className={styles.eventsSectionBadgeText}>Próximamente</span>
            </div>
            <h2 className={styles.eventsSectionTitle}>
              Eventos <span className={styles.eventsSectionTitleGold}>Imperdibles</span>
            </h2>
            <p className={styles.eventsSectionSubtitle}>
              No te pierdas estas experiencias únicas
            </p>
          </div>
          
          <div className={styles.eventsGrid}>
            {upcomingEvents.map((event, index) => (
              <div 
                key={event.id} 
                className={`${styles.eventCard} ${styles.fadeInSection} fade-in-section`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
          
          <div className={styles.eventsButton}>
            <Link to="/events" className={styles.eventsButtonLink}>
              Ver Todos los Eventos
              <ArrowRight className={styles.eventsButtonIcon} />
            </Link>
          </div>
        </section>

        {/* Separator */}
        <div className={styles.separator}>
          <div className={styles.separatorLine} />
        </div>

        {/* Urgent Event CTA - Super dramatic */}
        {urgentEvent && (
          <section className={`${styles.urgentSection} ${styles.fadeInSection} fade-in-section`}>
            <div className={styles.urgentCard}>
              {/* Glow effect */}
              <div className={styles.urgentGlow1} />
              <div className={styles.urgentGlow2} />
              
              <div className={styles.urgentContent}>
                <div className={styles.urgentDetails}>
                  <div className={styles.urgentBadge}>
                    <Calendar className={styles.urgentBadgeIcon} />
                    <span className={styles.urgentBadgeText}>
                      ¡Fecha Límite Próxima!
                    </span>
                  </div>
                  
                  <div className={styles.urgentInfo}>
                    <h3 className={styles.urgentTitle}>
                      {urgentEvent.title}
                    </h3>
                    <p className={styles.urgentDescription}>
                      {urgentEvent.description}
                    </p>
                    <div className={styles.urgentMeta}>
                      <span className={styles.urgentDate}>
                        {new Date(urgentEvent.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className={styles.urgentMetaDot}>•</span>
                      <span className={styles.urgentLocation}>{urgentEvent.location}</span>
                    </div>
                  </div>
                  
                  <Link to={`/event/${urgentEvent.id}`} className={styles.urgentButton}>
                    Reservar Ahora - ${urgentEvent.price}
                    <ArrowRight className={styles.urgentButtonIcon} />
                  </Link>
                </div>
                
                <div className={styles.urgentImageWrapper}>
                  <img
                    src={urgentEvent.image_url}
                    alt={urgentEvent.title}
                    className={styles.urgentImage}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Final CTA Section - Grand finale */}
        <section className={`${styles.finalSection} ${styles.fadeInSection} fade-in-section`}>
          {/* Background effects */}
          <div className={styles.finalBackground}>
            <div className={styles.finalGlow1} />
            <div className={styles.finalGlow2} />
          </div>
          
          <div className={styles.finalContent}>
            <div className={styles.finalHeader}>
              <h2 className={styles.finalTitle}>
                ¿Listo para la
                <span className={styles.finalTitleGold}>
                  Aventura?
                </span>
              </h2>
              <p className={styles.finalSubtitle}>
                Únete a miles de personas que ya disfrutan de experiencias únicas
              </p>
            </div>
            
            <div className={styles.finalButtons}>
              <Link to="/auth" className={styles.finalPrimaryButton}>
                Crear Cuenta Gratis
                <ArrowRight className={styles.buttonIcon} />
              </Link>
              <Link to="/events" className={styles.finalSecondaryButton}>
                Ver Todos los Eventos
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
