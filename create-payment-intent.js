// Vercel Serverless Function
// Endpoint: POST /api/create-payment-intent

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amount, currency = 'gbp' } = req.body;

    if (!amount || amount < 10) return res.status(400).json({ error: 'Minimum deposit is 10' });
    if (amount > 50000) return res.status(400).json({ error: 'Maximum deposit is 50,000' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: { source: 'blc_trading_ai' },
      description: `BLC Trading AI Deposit — ${currency.toUpperCase()} ${amount}`,
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message, code: error.code });
  }
};
