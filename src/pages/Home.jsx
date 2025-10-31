import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { EventCard } from '@/components/EventCard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { analytics } from '@/lib/analytics';
import heroImage from '@/assets/hero-events.jpg';
import styles from './Home.module.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const mainContentRef = useRef(null);
  const isTransitioningRef = useRef(false);
  
  // Check if user should see cover:
  // - Not if coming from internal navigation (location.state)
  // - Not if they've already seen it in this session
  const shouldShowCover = () => {
    // Check if coming from internal navigation
    if (location.state?.fromInternal) {
      return false;
    }
    
    // Check if already seen in this session
    const hasSeenCover = sessionStorage.getItem('hasSeenCover');
    if (hasSeenCover === 'true') {
      return false;
    }
    
    return true;
  };
  
  const [showCover, setShowCover] = useState(shouldShowCover());
  const [coverAnimationComplete, setCoverAnimationComplete] = useState(!shouldShowCover());
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  // Ensure body scroll is enabled when cover is not shown
  useEffect(() => {
    if (!shouldShowCover()) {
      document.body.style.overflow = 'auto';
    }
  }, []);

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
    if (!loading && coverAnimationComplete) {
      // HERO SECTION ANIMATIONS - Load after cover is gone
      // Background and image are already visible, animate content only
      
      // Hero badge animation
      gsap.fromTo(
        '.hero-badge',
        { opacity: 0, scale: 0.5, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'back.out(1.7)' }
      );

      // Dramatic title animations - each line separately
      gsap.fromTo(
        '.hero-title-line-1',
        { opacity: 0, x: -100, rotationX: -90 },
        { opacity: 1, x: 0, rotationX: 0, duration: 1, delay: 0.4, ease: 'power4.out' }
      );

      gsap.fromTo(
        '.hero-title-line-2',
        { opacity: 0, x: 100, rotationX: -90 },
        { opacity: 1, x: 0, rotationX: 0, duration: 1, delay: 0.6, ease: 'power4.out' }
      );

      // Hero subtitle animation
      gsap.fromTo(
        '.hero-subtitle-text',
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.8, ease: 'power3.out' }
      );

      // Hero CTA buttons
      gsap.fromTo(
        '.hero-cta-button',
        { opacity: 0, y: 30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 1.0, ease: 'back.out(1.5)', stagger: 0.1 }
      );

      // Light rays effect
      gsap.fromTo(
        '.hero-light-rays',
        { opacity: 0, scale: 0.8 },
        { opacity: 0.5, scale: 1, duration: 2, delay: 0.3, ease: 'power2.out' }
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
  }, [loading, coverAnimationComplete]);

  // Cover page scroll animation
  useEffect(() => {
    if (showCover && !loading) {
      // Block body scroll initially ONLY if we're not transitioning
      if (!isTransitioningRef.current) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      }
      
      // Animate cover entrance
      gsap.fromTo(
        '.cover-title',
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, delay: 0.3, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.cover-tagline',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.cover-scroll-indicator',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 1.2, ease: 'power2.out' }
      );

      // Add bounce animation to scroll indicator
      gsap.to('.cover-scroll-indicator', {
        y: 10,
        duration: 0.8,
        delay: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      let scrollCount = 0;
      const scrollThreshold = 2; // Number of scroll events needed

      // Handle scroll/wheel event
      const handleWheel = (e) => {
        if (e.deltaY > 0) { // Only count downward scrolls
          scrollCount++;
          
          if (scrollCount >= scrollThreshold) {
            // Remove listeners before triggering transition
            cleanupListeners();
            triggerCoverTransition();
          }
        }
      };

      // Handle touch events for mobile
      let touchStartY = 0;
      let touchMoveCount = 0;

      const handleTouchStart = (e) => {
        touchStartY = e.touches[0].clientY;
      };

      const handleTouchMove = (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        
        if (deltaY > 50) { // Swipe up detected
          touchMoveCount++;
          
          if (touchMoveCount >= scrollThreshold) {
            // Remove listeners before triggering transition
            cleanupListeners();
            triggerCoverTransition();
          }
        }
      };

      // Cleanup function for event listeners
      const cleanupListeners = () => {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
      };

      // Store cleanup function globally so click handler can access it
      window.__coverCleanup = cleanupListeners;

      window.addEventListener('wheel', handleWheel, { passive: true });
      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });

      return () => {
        cleanupListeners();
        delete window.__coverCleanup;
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
      };
    } else if (!showCover && coverAnimationComplete) {
      // If cover is not shown (already seen in session), show content immediately
      // Ensure body scroll is enabled
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      gsap.set('.main-content', { opacity: 1 });
    }
  }, [showCover, loading, coverAnimationComplete]);

  // Get the 4 upcoming events sorted by date
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  // Get the event with the closest deadline
  const urgentEvent = upcomingEvents[0];

  // Function to trigger the cover transition
  const triggerCoverTransition = () => {
    // Mark that we're transitioning
    isTransitioningRef.current = true;
    
    // Mark that user has seen the cover in this session
    sessionStorage.setItem('hasSeenCover', 'true');
    
    // Force enable scroll IMMEDIATELY - this is the key
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow');
    
    // Show main content immediately WITHOUT opacity 0 so browser calculates height
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.display = 'block';
      // Don't set opacity to 0 - let it be visible so body height is calculated
    }
    
    // Force browser to recalculate layout
    void document.body.offsetHeight;
    
    // Show placeholder for smooth transition
    setShowPlaceholder(true);
    
    // Start animation after a very brief delay to ensure DOM is updated
    requestAnimationFrame(() => {
      // NOW set opacity to 0 for animation
      if (mainContent) {
        gsap.set(mainContent, { opacity: 0 });
      }
      
      const timeline = gsap.timeline({
        onComplete: () => {
          // NOW hide the cover and show content
          setShowCover(false);
          setCoverAnimationComplete(true);
          setShowPlaceholder(false);
        }
      });
      
      // Cover zoom out and fade out
      const coverElement = document.querySelector('.cover-page');
      if (coverElement) {
        timeline.to(coverElement, {
          scale: 1.5,
          opacity: 0,
          duration: 1,
          ease: 'power2.in'
        }, 0);
      }
      
      // Placeholder fade out
      const placeholderElement = document.querySelector('.content-placeholder');
      if (placeholderElement) {
        timeline.to(placeholderElement, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in'
        }, 0.5);
      }
      
      // Main content fade in
      if (mainContent) {
        timeline.to(
          mainContent,
          { opacity: 1, duration: 1, ease: 'power2.out' },
          0
        );
      }
    });
  };

  // Function to scroll to main content (triggers cover transition if cover is visible)
  const scrollToMainContent = () => {
    if (showCover) {
      // Clean up event listeners before triggering transition
      if (window.__coverCleanup) {
        window.__coverCleanup();
        delete window.__coverCleanup;
      }
      // If cover is showing, trigger the transition
      triggerCoverTransition();
    } else if (mainContentRef.current) {
      // Otherwise, just scroll to content
      mainContentRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      {/* Cover Page - Only shown on first visit */}
      {showCover && (
        <div className={`${styles.coverPage} cover-page`}>
          <div className={styles.coverContent}>
            <div className={styles.coverGlow1} />
            <div className={styles.coverGlow2} />
              
              <h1 className={`${styles.coverTitle} cover-title`}>
                <span className={styles.coverTitleMain}>EventVault</span>
              </h1>
              
              <p className={`${styles.coverTagline} cover-tagline`}>
                Moments that last a lifetime,
              </p>
              <p className={`${styles.coverTagline} cover-tagline`}>
                Reserve extraordinary moments
              </p>
              
              <div 
                className={`${styles.coverScrollIndicator} cover-scroll-indicator`}
                onClick={scrollToMainContent}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.scrollText}>Scroll to discover</div>
                <div className={styles.scrollArrow}>
                  <ArrowRight className={styles.scrollArrowIcon} />
                </div>
              </div>
            </div>
        </div>
      )}

      {/* Placeholder to prevent footer from showing during transition */}
      {showPlaceholder && (
        <div className={`${styles.contentPlaceholder} content-placeholder`} />
      )}

      {/* Main Content */}
      <div 
        ref={mainContentRef}
        className={`${styles.container} main-content`}
        style={{ 
          display: (showCover && !isTransitioningRef.current) ? 'none' : 'block'
        }}
      >
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
              <span>Epic experiences</span>
              <Zap className={styles.heroBadgeIcon} fill="currentColor" />
            </div>

            {/* Main dramatic title */}
            <h1 className={styles.heroTitle}>
              <span className={`${styles.heroTitleLine1} hero-title-line-1`}>
                LIVE,
              </span>
              <span className={`${styles.heroTitleLine2} hero-title-line-2`}>
                EXPERIENCE
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`${styles.heroSubtitle} hero-subtitle-text`}>
              Moments that last a lifetime
            </p>

            {/* CTA Buttons */}
            <div className={`${styles.heroCta} ${user ? styles.heroCtaCentered : ''}`}>
              <Link 
                to="/events" 
                className={`${styles.heroCtaButton} hero-cta-button`}
                onClick={() => analytics.trackCTAClick('Browse Events', 'Hero Section')}
              >
                Browse events
                <ArrowRight className={styles.heroCtaButtonIcon} />
              </Link>
              {!user && (
                <Link 
                  to="/auth" 
                  className={`${styles.heroCtaSecondary} hero-cta-button`}
                  onClick={() => analytics.trackCTAClick('Sign In', 'Hero Section')}
                >
                  Sign in
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
              <span className={styles.eventsSectionBadgeText}>Coming soon...</span>
            </div>
            <h2 className={styles.eventsSectionTitle}>
              Main <span className={styles.eventsSectionTitleGold}>events</span>
            </h2>
            <p className={styles.eventsSectionSubtitle}>
              Dont miss out on these handpicked experiences
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
            <Link 
              to="/events" 
              className={styles.eventsButtonLink}
              onClick={() => analytics.trackCTAClick('Browse All Events', 'Events Section')}
            >
              Browse all events
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
                      Upcoming Deadline!
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
                  
                  <Link 
                    to={`/event/${urgentEvent.id}`} 
                    className={`${styles.urgentButton} urgent-button`}
                    onClick={() => analytics.trackCTAClick('Reserve Now', `Urgent Event - ${urgentEvent.title}`)}
                  >
                    Reserve now - ${urgentEvent.price}
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
                Ready for your next
                <span className={styles.finalTitleGold}>
                  Adventure?
                </span>
              </h2>
              <p className={styles.finalSubtitle}>
                Join EventVault today and unlock a world of unforgettable live experiences.
              </p>
            </div>
            
            <div className={styles.finalButtons}>
              <Link 
                to="/auth" 
                className={styles.finalPrimaryButton}
                onClick={() => analytics.trackCTAClick('Create Free Account', 'Final CTA Section')}
              >
                Create Free Account
                <ArrowRight className={styles.buttonIcon} />
              </Link>
              <Link 
                to="/events" 
                className={styles.finalSecondaryButton}
                onClick={() => analytics.trackCTAClick('Browse All Events', 'Final CTA Section')}
              >
                Browse all Events
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
};

export default Home;
