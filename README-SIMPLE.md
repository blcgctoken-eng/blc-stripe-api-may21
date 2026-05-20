# BLC Stripe Backend - Simple Deploy Guide

## What This Does
This is a small server that lets your BLC Trading AI website accept REAL credit card payments through Stripe. It sits between your website and Stripe.

---

## YOU NEED 2 THINGS BEFORE STARTING

1. **Your Stripe Secret Key** (starts with `sk_live_`)
   - Go to https://dashboard.stripe.com/apikeys
   - Click "Reveal" next to "Secret key"
   - Copy it (it looks like: `sk_live_51REf7h...`)
   - **Keep this private - never share it**

2. **A GitHub Account** (you already have this)

---

## STEP 1: Create a New GitHub Repository

1. Go to https://github.com/new
2. In "Repository name" type: `blc-stripe-backend`
3. Make sure it's set to **Public**
4. Click the green **"Create repository"** button

---

## STEP 2: Upload These Files to GitHub

On the page that appears after creating the repo:

1. Click the link that says **"uploading an existing file"**
2. You'll see a box that says "Drag files here..."
3. Upload ALL these files from this folder:
   - `package.json`
   - `stripe-server.js`
   - `vercel.json`
   - `.gitignore`
   - (and the `api/` folder with `create-payment-intent.js` inside it)
4. Scroll down and click **"Commit changes"**

---

## STEP 3: Deploy to Vercel

1. Go to https://vercel.com/new
2. Sign in with your **GitHub** account if asked
3. You'll see a list of your GitHub repos
4. Find and click on **`blc-stripe-backend`**
5. On the next page, you'll see:
   - Project Name: `blc-stripe-backend` (you can keep this)
   - Framework Preset: leave as "Other"
6. **IMPORTANT - Add Environment Variable:**
   - Click **"Environment Variables"** to expand it
   - In "Name" type: `STRIPE_SECRET_KEY`
   - In "Value" paste your Secret Key from Stripe (`sk_live_...`)
   - Click **"Add"**
7. Click the **"Deploy"** button
8. Wait 1-2 minutes for it to finish
9. You'll get a green checkmark and a URL like:
   ```
   https://blc-stripe-backend.vercel.app
   ```

**Copy this URL!** You need it for the last step.

---

## STEP 4: Give Me the URL

Send me the URL from Step 3 (the one that looks like `https://blc-stripe-backend-xxx.vercel.app`)

I will paste it into your BLC Trading AI website so deposits work automatically.

That's it! No coding needed from you.
