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
    const { paymentIntentId } = JSON.parse(event.body);

    if (!paymentIntentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Payment Intent ID is required'
        }),
      };
    }

    // Retrieve the PaymentIntent to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      }),
    };
  } catch (error) {
    console.error('Error retrieving payment:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error retrieving payment status',
        message: error.message
      }),
    };
  }
};
