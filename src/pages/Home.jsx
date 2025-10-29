import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { EventCard } from '@/components/EventCard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImage from '@/assets/hero-events.jpg';
import styles from './Home.module.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      // HERO SECTION ANIMATIONS - Load immediately
      gsap.fromTo(
        '.hero-background',
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.hero-image',
        { scale: 1.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8, ease: 'power2.out' }
      );

      // Hero badge animation
      gsap.fromTo(
        '.hero-badge',
        { opacity: 0, scale: 0.5, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'back.out(1.7)' }
      );

      // Dramatic title animations - each line separately
      gsap.fromTo(
        '.hero-title-line-1',
        { opacity: 0, x: -100, rotationX: -90 },
        { opacity: 1, x: 0, rotationX: 0, duration: 1, delay: 0.5, ease: 'power4.out' }
      );

      gsap.fromTo(
        '.hero-title-line-2',
        { opacity: 0, x: 100, rotationX: -90 },
        { opacity: 1, x: 0, rotationX: 0, duration: 1, delay: 0.7, ease: 'power4.out' }
      );

      gsap.fromTo(
        '.hero-title-line-3',
        { opacity: 0, x: -100, rotationX: -90 },
        { opacity: 1, x: 0, rotationX: 0, duration: 1, delay: 0.9, ease: 'power4.out' }
      );

      // Hero subtitle animation
      gsap.fromTo(
        '.hero-subtitle-text',
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 1.2, ease: 'power3.out' }
      );

      // Hero CTA buttons
      gsap.fromTo(
        '.hero-cta-button',
        { opacity: 0, y: 30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 1.4, ease: 'back.out(1.5)' }
      );

      // Light rays effect
      gsap.fromTo(
        '.hero-light-rays',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 2, delay: 0.5, ease: 'power2.out' }
      );

      // EVENTS SECTION - Trigger on scroll
      gsap.fromTo(
        '.fade-in-section',
        { opacity: 0, y: 60 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.2, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.fade-in-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // URGENT SECTION - Trigger on scroll
      const urgentCard = document.querySelector('.urgent-card');
      if (urgentCard) {
        gsap.fromTo(
          '.urgent-card',
          { opacity: 0, scale: 0.9, y: 50 },
          { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 1.2, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.urgent-card',
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );

        gsap.fromTo(
          '.urgent-badge',
          { opacity: 0, x: -30, rotate: -5 },
          { 
            opacity: 1, 
            x: 0, 
            rotate: 0, 
            duration: 0.8, 
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: '.urgent-card',
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );

        gsap.fromTo(
          '.urgent-title',
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            delay: 0.2, 
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.urgent-card',
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );

        gsap.fromTo(
          '.urgent-description',
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            delay: 0.4, 
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.urgent-card',
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );

        gsap.fromTo(
          '.urgent-meta',
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            delay: 0.6, 
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.urgent-card',
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );

        gsap.fromTo(
          '.urgent-button',
          { opacity: 0, scale: 0.8, y: 20 },
          { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.8, 
            delay: 0.8, 
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: '.urgent-card',
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );

        gsap.fromTo(
          '.urgent-image',
          { opacity: 0, scale: 1.2, x: 50 },
          { 
            opacity: 1, 
            scale: 1, 
            x: 0, 
            duration: 1.2, 
            delay: 0.3, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.urgent-card',
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );

        // Glows animations
        gsap.fromTo(
          '.urgent-glow',
          { opacity: 0, scale: 0.5 },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 2, 
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.urgent-card',
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loading]);

  // Get the 4 upcoming events sorted by date
  const upcomingEvents = [...events]
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
          <div className={`${styles.heroBackground} hero-background`} />
          <img
            src={heroImage}
            alt="Events hero"
            className={`${styles.heroImage} hero-image`}
          />
          <div className={styles.heroOverlay} />
          
          {/* Animated light rays effect */}
          <div className={`${styles.heroLightRays} hero-light-rays`} />
          
          <div className={styles.heroContent}>
            {/* Small badge */}
            <div className={`${styles.heroBadge} hero-badge`}>
              <Zap className={styles.heroBadgeIcon} fill="currentColor" />
              <span>Experiencias Épicas</span>
              <Zap className={styles.heroBadgeIcon} fill="currentColor" />
            </div>

            {/* Main dramatic title */}
            <h1 className={styles.heroTitle}>
              <span className={`${styles.heroTitleLine1} hero-title-line-1`}>
                ES AUTOMÁTICO
              </span>
              <span className={`${styles.heroTitleLine2} hero-title-line-2`}>
                ES SISTEMÁTICO
              </span>
              <span className={`${styles.heroTitleLine3} hero-title-line-3`}>
                ES HIDROMÁTICO
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`${styles.heroSubtitle} hero-subtitle-text`}>
              ¡Son los eventos más electrizantes!
            </p>

            {/* CTA Buttons */}
            <div className={`${styles.heroCta} ${user ? styles.heroCtaCentered : ''}`}>
              <Link to="/events" className={`${styles.heroCtaButton} hero-cta-button`}>
                Ver Eventos
                <ArrowRight className={styles.heroCtaButtonIcon} />
              </Link>
              {!user && (
                <Link to="/auth" className={`${styles.heroCtaSecondary} hero-cta-button`}>
                  Iniciar Sesión
                </Link>
              )}
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
            <div className={`${styles.urgentCard} urgent-card`}>
              {/* Glow effect */}
              <div className={`${styles.urgentGlow1} urgent-glow`} />
              <div className={`${styles.urgentGlow2} urgent-glow`} />
              
              <div className={styles.urgentContent}>
                <div className={styles.urgentDetails}>
                  <div className={`${styles.urgentBadge} urgent-badge`}>
                    <Calendar className={styles.urgentBadgeIcon} />
                    <span className={styles.urgentBadgeText}>
                      ¡Fecha Límite Próxima!
                    </span>
                  </div>
                  
                  <div className={styles.urgentInfo}>
                    <h3 className={`${styles.urgentTitle} urgent-title`}>
                      {urgentEvent.title}
                    </h3>
                    <p className={`${styles.urgentDescription} urgent-description`}>
                      {urgentEvent.description}
                    </p>
                    <div className={`${styles.urgentMeta} urgent-meta`}>
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
                  
                  <Link to={`/event/${urgentEvent.id}`} className={`${styles.urgentButton} urgent-button`}>
                    Reservar Ahora - ${urgentEvent.price}
                    <ArrowRight className={styles.urgentButtonIcon} />
                  </Link>
                </div>
                
                <div className={styles.urgentImageWrapper}>
                  <img
                    src={urgentEvent.image_url}
                    alt={urgentEvent.title}
                    className={`${styles.urgentImage} urgent-image`}
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
