# BLC Trading AI — Stripe Backend

## Deploy to Vercel (Fastest)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Set Your Stripe Secret Key
```bash
# Your Secret Key starts with sk_live_... (NOT the pk_live_ key)
vercel env add STRIPE_SECRET_KEY
# When prompted, paste: sk_live_...
```

### Step 3: Deploy
```bash
cd backend
vercel --prod
```

### Step 4: Copy the URL
Vercel will give you a URL like:
```
https://blc-stripe-backend.vercel.app
```

**Paste this URL back to the BLC developer** and they will wire it into the frontend.

---

## Deploy to Railway (Alternative)

1. Go to https://railway.app
2. Click **New Project**
3. Click **Deploy from Repo**
4. Upload this `backend` folder
5. Add environment variable: `STRIPE_SECRET_KEY=sk_live_...`
6. Click Deploy
7. Copy the URL and paste it back

---

## Run Locally (For Testing)

```bash
cd backend
npm install
STRIPE_SECRET_KEY=sk_live_your_key_here npm start
```

Server runs on http://localhost:3001

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| POST | `/api/create-payment-intent` | Creates a Stripe PaymentIntent |

### POST /api/create-payment-intent

**Request body:**
```json
{
  "amount": 500,
  "currency": "gbp"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_yyy",
  "paymentIntentId": "pi_xxx",
  "amount": 50000,
  "currency": "gbp",
  "status": "requires_confirmation"
}
```

---

## What You Need

| What | Where to Get It | Example |
|------|----------------|---------|
| **Secret Key** | https://dashboard.stripe.com/apikeys | `sk_live_...` |
| **Publishable Key** | (already in frontend) | `pk_live_51REf7h...` |

**⚠️ Never share your Secret Key publicly. Never commit it to git.**
