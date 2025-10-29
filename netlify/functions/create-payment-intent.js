const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { amount, currency = 'usd', eventId, eventName, userId } = JSON.parse(event.body);

    // Validate required fields
    if (!amount || !eventId || !userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          details: 'amount, eventId, and userId are required'
        }),
      };
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        eventId: eventId.toString(),
        eventName: eventName || '',
        userId: userId.toString(),
      },
      description: `Payment for event: ${eventName || eventId}`,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Card error',
          message: error.message,
          type: error.type,
          code: error.code
        }),
      };
    }

    if (error.type === 'StripeInvalidRequestError') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid request',
          message: error.message,
          type: error.type
        }),
      };
    }

    if (error.type === 'StripeAPIError') {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Stripe API error',
          message: 'An error occurred with Stripe. Please try again later.'
        }),
      };
    }

    // Generic error
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Payment processing error',
        message: error.message || 'An unexpected error occurred'
      }),
    };
  }
};
