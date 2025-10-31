import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';
import { analytics } from '@/lib/analytics';
import styles from './Payment.module.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// API endpoint based on environment
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:8888/.netlify/functions' 
  : '/.netlify/functions';

function CheckoutForm({ reservation, event, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  // Create PaymentIntent on mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch(`${API_URL}/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: event.price,
            currency: 'usd',
            eventId: event.id,
            eventName: event.title,
            userId: reservation.user_id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || 'Error creating payment intent');
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError(err.message);
        toast({
          title: 'Error',
          description: 'Could not initialize payment. Please try again.',
          variant: 'destructive',
        });
      }
    };

    createPaymentIntent();
  }, [event.id, event.price, event.title, reservation.user_id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);
    setError(null);
    
    // Track payment initiated
    analytics.trackPaymentInitiated(event.id, event.title, Number(event.price) || 0);

    try {
      const cardElement = elements.getElement(CardElement);

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        // Handle different types of Stripe errors
        let errorMessage = 'Could not process payment.';
        
        switch (stripeError.code) {
          case 'card_declined':
            errorMessage = 'Your card was declined. Please try another card.';
            break;
          case 'insufficient_funds':
            errorMessage = 'Insufficient funds on the card.';
            break;
          case 'expired_card':
            errorMessage = 'Your card has expired.';
            break;
          case 'incorrect_cvc':
            errorMessage = 'The CVC code is incorrect.';
            break;
          case 'processing_error':
            errorMessage = 'Error processing payment. Please try again.';
            break;
          case 'incorrect_number':
            errorMessage = 'The card number is incorrect.';
            break;
          default:
            errorMessage = stripeError.message || errorMessage;
        }

        throw new Error(errorMessage);
      }

      // Payment successful
      if (paymentIntent.status === 'succeeded') {
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
      } else {
        throw new Error('El pago no se completó correctamente.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message);
      
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

  // Show loading state while creating payment intent
  if (!clientSecret && !error) {
    return (
      <div className={styles.loadingPayment}>
        <div className={styles.spinner} />
        <p>Loading payment...</p>
      </div>
    );
  }

  // Show error if payment intent creation failed
  if (error && !clientSecret) {
    return (
      <div className={styles.errorPayment}>
        <AlertCircle className={styles.errorIcon} />
        <p>Error initializing payment</p>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle className={styles.errorBannerIcon} />
          <p>{error}</p>
        </div>
      )}
      
      <div className={styles.cardElementWrapper}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '18px',
                color: '#0a0a0a',
                backgroundColor: '#ffffff',
                '::placeholder': {
                  color: '#52525b',
                },
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontWeight: '500',
                lineHeight: '24px',
              },
              invalid: {
                color: '#dc2626',
                iconColor: '#dc2626',
              },
              complete: {
                color: '#0a0a0a',
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className={styles.submitButton}
      >
        {processing ? (
          <>
            <div className={styles.spinner} />
            Loading...
          </>
        ) : (
          <>
            <Lock size={20} />
            Pay €{event.price.toFixed(2)}
          </>
        )}
      </button>

      <p className={styles.secureNote}>
        <Lock size={16} />
        Secure payment processed by Stripe
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
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className={styles.header}>
          <CreditCard size={48} className={styles.headerIcon} />
          <h1>Complete Your Payment</h1>
          <p>Confirm your reservation for {event.title}</p>
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
              <span>Ticket</span>
              <span>€{event.price.toFixed(2)}</span>
            </div>
            <div className={styles.priceRow}>
              <span>Service Fee</span>
              <span>€0.00</span>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>€{event.price.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.paymentSection}>
            <h2>Payment Information</h2>
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
