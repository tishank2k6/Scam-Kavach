# 🛡️ Scam Kavach Frontend

The modern, responsive web application for **Scam Kavach** built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide icons, and Three.js 3D security visuals.

## Features Included

- **Forensic Message & Offer Scanner:** Real-time text and link analysis with interactive phrase highlighting and severity tooltips.
- **Offer Letter PDF Inspector:** Upload appointment letters and contracts to verify legitimacy.
- **3D Security Shield:** Interactive Three.js model featuring dynamic lighting, gold/emerald metallic reflections, and floating particles.
- **Dedicated Login Portal (`/login`):** Guest access (10 free credits), student sign-in, and account registration.
- **Razorpay Subscription Gateway:** Pricing tiers (Free, Standard, Pro, Premium) with live Razorpay checkout and fallback simulator.
- **Community Scam Registry (`/community`):** Crowd-sourced database of verified job scam alerts.
- **Dynamic Threat Intelligence Dashboard (`/dashboard`):** Real-time persistent metrics and trend graphs.
- **Audit & Privacy (`/history`):** Redacted PII review, incognito mode, and one-click history purging.

## Getting Started Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   Create `.env.local` or ensure `NEXT_PUBLIC_API_URL` is set:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Deploying to Vercel

1. Import the repository `https://github.com/tishank2k6/Scam-Kavach` on [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend`.
3. Add the environment variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed FastAPI backend endpoint (e.g. `https://your-backend.onrender.com/api/v1`).
4. Click **Deploy**.
