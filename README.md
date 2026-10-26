# 🛡️ Scam Kavach: Smart Scam Detection for Students & Job Seekers

> **Enterprise-Grade Cybersecurity & Forensic Verification Platform for Early-Career Opportunities**

Scam Kavach protects students, college graduates, and job seekers from predatory recruitment tactics—including **advance-fee onboarding charges**, **Telegram/WhatsApp task scams**, **free webmail impersonation**, **fake placement guarantees**, **fraudulent offer letters**, and **credential-harvesting links**.

Designed with a high-contrast, human-crafted visual identity utilizing vibrant emerald green (`#059669`), warm sunset amber (`#F97316`), and a clean slate canvas (`#F8FAFC`)—deliberately eliminating generic black, blue, and purple AI themes.

---

## ⚡ Key Highlights & Platform Features

- 🛡️ **Interactive 3D Security Shield:** Realistic metallic gold & emerald security shield rendered in Three.js with dynamic camera tracking, warm sunlight highlights, amber rim lights, and floating gold particles.
- 🔑 **Dedicated Login & Entrance Portal (`/login`):** Three distinct access modes—**Instant Guest Mode** (preloaded with 10 free credits), **Member Sign-In**, and **Student Registration**.
- 💳 **Razorpay Subscription Gateway (`/#pricing`):**
  - **Free Tier:** ₹0 / 10 scans included
  - **Standard Tier:** ₹199/month / 100 scans + Offer Letter PDF analysis
  - **Pro Tier:** ₹499/month / 500 scans + priority forensic verification + API access
  - **Premium Tier:** ₹1,499/month / Unlimited scans + 24/7 scam defense counselor
  - Includes real-time Razorpay order creation (`/api/v1/billing/create-order`), cryptographic HMAC-SHA256 signature verification (`/api/v1/billing/verify-payment`), and an interactive fallback demo simulator for offline evaluations.
- 📄 **Offer Letter PDF Document Scanner:** Upload PDF appointment contracts (`/api/v1/scan-file/offer-letter`); automatically parses text streams via `pypdf` and checks for forged registration numbers, equipment deposit clauses, and domain spoofing.
- 👥 **Community Scam Registry (`/community`):** Crowd-sourced recruitment warning board where students can report fraudulent recruiters, search past incident logs, and upvote alerts.
- 🔍 **Hybrid Multi-Layer Analysis Pipeline:** Combines deterministic forensic NLP heuristics (extracting exact phrase character offsets) with a calibrated scikit-learn baseline model (`TF-IDF + CalibratedClassifierCV`).
- 🎯 **Interactive Evidence Highlighter:** Flagged text phrases are highlighted in real-time. Clicking/hovering on any flagged phrase displays a forensic tooltip detailing the violation rule, severity, and educational guidance.
- 🌐 **SSRF-Safe URL Inspector:** 100% passive structural inspection. The backend **never** connects to or downloads from submitted target URLs, completely eliminating Server-Side Request Forgery risks.
- 📊 **Real-Time Database-Derived Analytics (`/dashboard`):** Metrics are computed dynamically from persistent database records (PostgreSQL / SQLite fallback).
- 🔒 **Privacy-by-Design & Data Minimization:** Automated PII scrubber masks phone numbers, emails, and financial credentials before persistence. Includes Incognito Mode and 1-click history purging (`/history`).
- ⚡ **1-Click Synthetic Demo Suite:** 6 preloaded real-world scenarios (Stripe Legit Offer, AWS Laptop Fee, YouTube Video Tasks, Microsoft Recruiter Spoof, Placement Guarantee, Malicious IP URL) allowing judges to experience the full analysis pipeline instantly without typing.

---

## 🏗️ System Architecture

```
                       ┌──────────────────────────────────────────┐
                       │          Scam Kavach Next.js App         │
                       │  (Dark Multicolor Theme, 3D Canvas, Razorpay)
                       └────────────────────┬─────────────────────┘
                                            │ HTTP / JSON / Multipart
                                            ▼
                       ┌──────────────────────────────────────────┐
                       │         FastAPI Security Gateway         │
                       │  (Rate Limiter, Auth JWT, PII Redaction) │
                       └────────────────────┬─────────────────────┘
                                            │
        ┌───────────────────┬───────────────┼───────────────┬───────────────────┐
        ▼                   ▼               ▼               ▼                   ▼
┌───────────────┐   ┌───────────────┐ ┌───────────┐ ┌───────────────┐   ┌───────────────┐
│ Heuristics    │   │ Calibrated ML │ │ SSRF URL  │ │ PDF Document  │   │ Razorpay /    │
│ Engine        │   │ Classifier    │ │ Analyzer  │ │ Parser        │   │ Billing API   │
│ (Advance fee, │   │ (TF-IDF +     │ │ (Passive  │ │ (pypdf multi- │   │ (Order create │
│  spoofing)    │   │  Calibrated)  │ │  RFC1918) │ │  page stream) │   │  & verify)    │
└───────┬───────┘   └───────┬───────┘ └─────┬─────┘ └───────┬───────┘   └───────┬───────┘
        │                   │               │               │                   │
        └───────────────────┴───────────────┼───────────────┴───────────────────┘
                                            │
                                            ▼
                       ┌──────────────────────────────────────────┐
                       │       Hybrid Fusion Scoring Engine       │
                       │        (Calibrated Score 0 - 100)        │
                       └────────────────────┬─────────────────────┘
                                            │
                       ┌────────────────────┴────────────────────┐
                       │                                         │
                       ▼                                         ▼
        ┌─────────────────────────────┐           ┌─────────────────────────────┐
        │    Explainability Engine    │           │    Database Persistence     │
        │ (Forensic Verification Rule │           │    (Users, ScanRecords,     │
        │    or Provider LLM)         │           │    Orders, ReportedScams)   │
        └─────────────────────────────┘           └─────────────────────────────┘
```

---

## 🚀 Quickstart Guide

### Option 1: Local Development (Without Docker)

#### Prerequisites
- Node.js 18+ (tested on Node.js 22 & 24)
- Python 3.10+ (tested on Python 3.13)

#### Step 1: Start Backend (FastAPI)
```bash
# In c:\ScamShield\backend
cd backend

# Create & activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run model training & evaluation
python -m app.ml.train

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Step 2: Start Frontend (Next.js)
```bash
# In c:\ScamShield\frontend
cd frontend

# Install dependencies
npm install

# Start Next.js dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

### Option 2: Docker Deployment

```bash
docker compose up --build
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check:** [http://localhost:8000/api/v1/health/](http://localhost:8000/api/v1/health/)

---

## 🧪 Automated Test Suite

Scam Kavach includes automated unit and integration tests covering heuristic detection, SSRF safety, prompt injection defense, and API endpoints:

```bash
cd backend
venv\Scripts\activate
pytest -v
```

All 15 automated test suites pass with 100% compliance.

---

## 📊 ML Model Evaluation & Transparency Disclosure

The baseline text classifier was evaluated with stratified train/test split. Evaluation results (`app/ml/metrics_report.json`):

| Metric | Score | Note |
| :--- | :--- | :--- |
| **Model Type** | TF-IDF + Calibrated Logistic Regression | Sigmoid calibration prevents score polarization |
| **Accuracy** | **87.5%** | Evaluated on unseen test set |
| **Recall** | **1.00 (100%)** | Zero false negatives on critical scam indicators |
| **Precision** | **0.80 (80%)** | High confidence in flagged scam phrases |
| **F1 Score** | **0.8889** | Balanced performance across classes |

> **Limitations Disclosure:** The classifier is an assistive screening tool, not a court-admissible verdict. Deterministic heuristic rules complement the model to catch brand impersonation and payment coercion.

---

## 🛡️ Hackathon Demo Walkthrough (For Judges)

1. **Brand Identity & 3D Shield:** Visit [http://localhost:3000](http://localhost:3000). Notice the warm slate background, crisp emerald/amber contrast (no generic black, blue, or purple AI tropes), and the interactive metallic 3D gold & emerald shield reacting to your cursor.
2. **Dedicated Login Entrance:** Click **"Login / Enter"** or visit `/login`. Try **"Instant Guest Access"** to immediately enter with 10 preloaded scan credits.
3. **1-Click Scam Scan:** On the home scanner, click the **"Fake Internship Laptop Fee"** preset and hit **"ANALYZE NOW"**.
   - Observe the **Calibrated Risk Meter (80-95 / 100)** with the High Risk badge.
   - In the **Interactive Evidence Highlighter**, hover over the flagged phrase (*"pay $150 for your laptop..."*) to view the forensic rule popup.
   - Review the **Recommended Verification Checklist**.
4. **Legitimate Contrast:** Click the **"Authentic Stripe Intern Offer"** preset and run the scan.
   - Observe the score drop to **Low Risk (0-20/100)** with celebratory confetti.
5. **Offer Letter PDF Scanner:** Click the **"Offer Letter PDF"** tab in the scanner. Drag and drop any PDF appointment contract to extract text streams and evaluate advance payment or forged signature indicators.
6. **URL Inspection:** Switch to the **"Suspicious URL Inspector"** tab and load the **"Lookalike IP-Based Phishing Portal"** preset.
   - Notice the SSRF-Safe passive analysis highlighting raw IP hostname and high-risk TLDs.
7. **Razorpay Pricing & Subscription:** Scroll to **"Subscription Plans"** or click **"Pricing"** in the navigation. Select **"Upgrade to Pro"** (₹499/mo). Test the checkout flow—it connects to Razorpay or offers an instant mock simulation that increments your user credit balance on completion.
8. **Community Scam Registry:** Navigate to `/community` to browse recent scam warnings submitted by students, search for recruiter handles, and upvote community alerts.
9. **Live Dashboard & History:**
   - Navigate to `/dashboard` to see database-derived aggregated metrics.
   - Navigate to `/history` to review your session log and test the single-click deletion control.

---

## 🔒 Security & Privacy Policy

- **Zero-Storage Consent:** Uncheck *"Save anonymized scan to personal history"* for 100% in-memory ephemeral evaluation.
- **Automated PII Scrubbing:** All emails, phone numbers, and payment credentials are automatically redacted with `[REDACTED_EMAIL]`, `[REDACTED_PHONE]`, etc.
- **SSRF Immunity:** The backend strictly parses URL structure and never performs outbound HTTP connections to user-submitted domains.
- **Secret Scrubbing:** Logger automatically intercepts and redacts API keys, bearer tokens, and passwords from console logs.

---

## 📄 License & Attribution

Built for the Hackathon/Ideathon community. Distributed under the MIT License.

