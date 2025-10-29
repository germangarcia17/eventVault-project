import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';
import { analytics } from '@/lib/analytics';
import styles from './Payment.module.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ reservation, event, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    
    // Track payment initiated
    analytics.trackPaymentInitiated(event.id, event.title, Number(event.price) || 0);

    try {
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      // In a real app, you'd send paymentMethod.id to your backend
      // For now, we'll simulate a successful payment
      await simulatePayment(paymentMethod.id);

      // Generate QR code data
      const qrData = `EVT-${event.id}-${reservation.user_id}-${Date.now()}`;

      // Update reservation in database
      const { error: updateError } = await supabase
        .from('reservations')
        .update({
          payment_status: 'paid',
          qr_code: qrData,
        })
        .eq('id', reservation.id);

      if (updateError) throw updateError;

      // Track successful payment
      analytics.trackPaymentSuccess(event.id, event.title, Number(event.price) || 0);
      analytics.trackBookingCompleted(event.id, event.title, Number(event.price) || 0);

      toast({
        title: '¡Pago exitoso!',
        description: 'Tu entrada ha sido confirmada. Recibirás un correo con tu código QR.',
      });

      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      
      // Track failed payment
      analytics.trackPaymentFailed(event.id, event.title, error.message);
      
      toast({
        title: 'Error en el pago',
        description: error.message || 'No se pudo procesar el pago. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Simulate payment processing (remove in production)
  const simulatePayment = (paymentMethodId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Payment processed:', paymentMethodId);
        resolve();
      }, 2000);
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.cardElementWrapper}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1a1a1a',
                '::placeholder': {
                  color: '#6b7280',
                },
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              },
              invalid: {
                color: '#ef4444',
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className={styles.submitButton}
      >
        {processing ? (
          <>
            <div className={styles.spinner} />
            Procesando...
          </>
        ) : (
          <>
            <Lock size={20} />
            Pagar €{event.price.toFixed(2)}
          </>
        )}
      </button>

      <p className={styles.secureNote}>
        <Lock size={16} />
        Pago seguro procesado por Stripe
      </p>
    </form>
  );
}

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const reservation = location.state?.reservation;
  const event = location.state?.event;

  useEffect(() => {
    // Redirect if no reservation data
    if (!reservation || !event) {
      toast({
        title: 'Error',
        description: 'No se encontró información de la reserva.',
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }

    // Check if already paid
    if (reservation.payment_status === 'paid') {
      toast({
        title: 'Reserva ya pagada',
        description: 'Esta reserva ya ha sido pagada.',
      });
      navigate('/dashboard');
      return;
    }

    setLoading(false);
  }, [reservation, event, navigate, toast]);

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/dashboard', { state: { activeTab: 'payments' } });
    }, 1500);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
          <ArrowLeft size={20} />
          Volver al Dashboard
        </button>

        <div className={styles.header}>
          <CreditCard size={48} className={styles.headerIcon} />
          <h1>Completa tu Pago</h1>
          <p>Confirma tu reserva para {event.title}</p>
        </div>

        <div className={styles.paymentCard}>
          <div className={styles.eventInfo}>
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className={styles.eventImage}
              />
            )}
            <div className={styles.eventDetails}>
              <h3>{event.title}</h3>
              <p className={styles.eventDate}>
                {new Date(event.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className={styles.eventLocation}>{event.location}</p>
            </div>
          </div>

          <div className={styles.priceSummary}>
            <div className={styles.priceRow}>
              <span>Entrada</span>
              <span>€{event.price.toFixed(2)}</span>
            </div>
            <div className={styles.priceRow}>
              <span>Comisión de servicio</span>
              <span>€0.00</span>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>€{event.price.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.paymentSection}>
            <h2>Información de Pago</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                reservation={reservation}
                event={event}
                onSuccess={handleSuccess}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}
