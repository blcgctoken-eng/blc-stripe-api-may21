// ═══════════════════════════════════════════════
// BLC Trading AI — Stripe Backend Server
// ═══════════════════════════════════════════════
// 
// This server creates PaymentIntents for your frontend.
// Deploy this to Vercel, Railway, or run it locally.
//
// Required environment variable:
//   STRIPE_SECRET_KEY=sk_live_...   (from https://dashboard.stripe.com/apikeys)
//
// ─── Deploy to Vercel (FREE) ───
// 1. npm i -g vercel
// 2. cd backend
// 3. vercel
//
// ─── Deploy to Railway (FREE) ───
// 1. Go to railway.app
// 2. New Project → Deploy from Repo
//
// ─── Run locally ───
// 1. npm install express stripe cors
// 2. STRIPE_SECRET_KEY=sk_... node stripe-server.js
//
// ─── Frontend config ───
// Set your backend URL in src/lib/stripe.ts:
//   const API_BASE = 'https://your-backend.vercel.app'
//
// ═══════════════════════════════════════════════

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const app = express();

// Allow requests from your frontend
// Replace with your actual domain in production
app.use(cors({
  origin: [
    'https://wl6fi5qbo7566.kimi.page',     // Your current deployment
    'https://blctrading.ai',                // Your custom domain (when added)
    'http://localhost:5173',                // Local dev
    'http://localhost:3000',                // Local dev alt
  ],
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// ─── Health Check ───
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'BLC Stripe Backend', timestamp: new Date().toISOString() });
});

// ─── Create Payment Intent ───
app.post('/api/stripe/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'gbp' } = req.body;

    // Validation
    if (!amount || amount < 10) {
      return res.status(400).json({ error: 'Minimum deposit is £10' });
    }
    if (amount > 50000) {
      return res.status(400).json({ error: 'Maximum deposit is £50,000' });
    }
    if (!['gbp', 'usd', 'eur'].includes(currency)) {
      return res.status(400).json({ error: 'Currency must be gbp, usd, or eur' });
    }

    // Create PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to pence/cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        source: 'blc_trading_ai',
        timestamp: new Date().toISOString(),
      },
      description: `BLC Trading AI Deposit — ${currency.toUpperCase()} ${amount}`,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });

  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({
      error: error.message || 'Failed to create payment intent',
      code: error.code,
    });
  }
});

// ─── Retrieve Payment Status ───
app.get('/api/stripe/payment-status/:id', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);
    res.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      receiptUrl: paymentIntent.charges?.data?.[0]?.receipt_url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Payment Webhook (optional — for async events) ───
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('Payment succeeded:', paymentIntent.id, paymentIntent.amount);
    // TODO: Update user's balance in your database
  }

  res.json({ received: true });
});

// ─── Start Server ───
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`BLC Stripe Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Create payment: POST http://localhost:${PORT}/api/stripe/create-payment-intent`);
});

module.exports = app;
