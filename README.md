# 🛡️ Scam Kavach (स्कैम कवच)

> **Smart Cybersecurity & Forensic Verification Platform for Students and Job Seekers**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Language-Python%203.10+-3776AB?style=flat&logo=python)](https://python.org/)
[![Three.js](https://img.shields.io/badge/3D-Three.js-orange?style=flat&logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 What is Scam Kavach?

**Scam Kavach** is an enterprise-grade scam detection and forensic verification platform tailored for early-career students and job seekers. It instantly assesses suspicious job offers, internship messages, recruiter emails, payment demands, and interview links to protect users from fraudulent schemes.

Rather than giving a simple "safe/unsafe" label, Scam Kavach explains **why** a message is suspicious, extracts and highlights the exact evidence phrases with hover tooltips, and generates a **safe step-by-step verification checklist** before any money or sensitive data is shared.

---

## ⚡ Key Features at a Glance

| Feature | Description |
| :--- | :--- |
| 🛡️ **Forensic Message Scanner** | Analyzes recruitment emails, SMS, and WhatsApp messages using deterministic NLP heuristics and calibrated ML (`TF-IDF + CalibratedClassifierCV`). |
| 🎯 **Interactive Evidence Highlighter** | Highlights predatory phrases directly in the text with interactive badges indicating severity, rule violated, and forensic explanations. |
| 📄 **Offer Letter PDF Inspector** | Extracts and audits appointment contracts to detect mandatory laptop/training deposits, forged corporate registrations, and spoofed domains. |
| 🌐 **SSRF-Safe URL Inspector** | 100% passive link audit that inspects domain age, high-risk TLDs, and IP hostnames **without** connecting to hostile servers. |
| 🛡️ **Interactive 3D Security Shield** | High-performance Three.js 3D golden-emerald shield with dynamic cursor tracking, ambient lighting, and floating particles. |
| 💳 **Razorpay Subscription Gateway** | 4-tier billing system (**Free**, **Standard ₹199**, **Pro ₹499**, **Premium ₹1,499**) with live Razorpay checkout and fallback simulator. |
| 👥 **Community Scam Registry** | Crowd-sourced recruitment threat board (`/community`) where students can search recruiter handles, report incidents, and upvote alerts. |
| 📊 **Dynamic Telemetry Dashboard** | Database-backed analytics (`/dashboard`) displaying real-time threat categories, average risk scores, and detection trends. |
| 🔒 **Privacy-by-Design & Incognito Mode** | Automated PII scrubber masks phone numbers, emails, and credentials prior to analysis. Includes 1-click history purging (`/history`). |
| ⚡ **1-Click Preloaded Demo Presets** | 6 synthetic scenarios (Stripe offer, AWS equipment fee, YouTube task scam, Microsoft recruiter spoof, etc.) for instant zero-typing evaluation. |

---

## 🔍 How Scam Kavach Analyzes Threats

Scam Kavach uses a transparent **3-stage verification pipeline**:

```
[User Input: Text, PDF, or URL]
           │
           ▼
1. PII Redaction & Sanitization ─── (Masks emails, phone numbers, payment credentials)
           │
           ▼
2. Hybrid Detection Engine
   ├── Forensic NLP Rules ──────── (Detects advance fees, WhatsApp tasks, urgency, spoofed domains)
   ├── Calibrated ML Model ─────── (TF-IDF + Calibrated Logistic Regression, 0.0 - 1.0 probability)
   └── Passive URL Structural Scan (Checks Punycode homographs, IP hostnames, high-risk TLDs)
           │
           ▼
3. Scoring & Forensic Report
   ├── Composite Risk Score ────── (Calibrated 0 to 100 Meter)
   ├── Highlighted Text Badges ─── (Interactive evidence phrases with hover explanations)
   └── Safe Action Checklist ───── (Concrete verification steps before responding)
```

---

## 🧭 Application Pages & Navigation

* **`/` (Home / Scanner):** 3D interactive shield, 1-click synthetic presets, text scanner, PDF offer letter uploader, URL inspector, and subscription plans.
* **`/login` (Access Portal):** Instant Guest Access (10 free credits), student sign-in, and account registration.
* **`/community` (Community Registry):** Searchable scam database, crowd-sourced recruiter reports, and community upvotes.
* **`/dashboard` (Live Analytics):** Real-time persistent telemetry, threat categorization, and detection statistics.
* **`/history` (Privacy & History):** Review past scans, inspect redacted PII, or execute 1-click permanent deletion.
* **`/about` (Mission & Architecture):** Project overview, detection methodology, and privacy disclosures.

---

## 📂 Repository Structure

```
ScamShield/
├── frontend/                     # Next.js 16 App Router (React 19, TypeScript, Tailwind)
│   ├── src/app/                  # Application routes (/, /about, /community, /dashboard, /history, /login)
│   ├── src/components/           # 3D Three.js shield, Message Scanner, Razorpay billing modal, layout
│   ├── src/lib/                  # API client (api.ts) and preloaded demo scenarios (presets.ts)
│   ├── package.json              # Frontend dependencies
│   └── tsconfig.json             # TypeScript configuration
├── backend/                      # FastAPI Python Backend
│   ├── app/api/v1/endpoints/     # Endpoints: analyze, auth, billing, community, file_scan, health, history, stats
│   ├── app/core/                 # Configuration, logging, PII security filters
│   ├── app/db/                   # SQLAlchemy database session & persistent models (SQLite / PostgreSQL)
│   ├── app/ml/                   # Trained classifier (.joblib), NLP heuristics, dataset, URL analyzer
│   ├── tests/                    # Pytest test suite (15/15 passing unit & integration tests)
│   ├── main.py                   # ASGI entrypoint for Vercel and production runners
│   └── requirements.txt          # Python dependencies
├── vercel.json                   # Root multi-service deployment configuration for Vercel
├── docker-compose.yml            # Multi-container setup (Postgres + Backend + Frontend)
├── .env.example                  # Safe environment template
└── README.md                     # Documentation
```

---

## 🚀 Quick Start Guide

### Option 1: Local Development

#### 1. Backend Setup (FastAPI)
```bash
# Navigate to backend and create virtual environment
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend runs at `http://localhost:8000` (Interactive Swagger docs: `http://localhost:8000/docs`).

#### 2. Frontend Setup (Next.js)
```bash
# In a separate terminal, navigate to frontend
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

### Option 2: Docker Compose

Run the complete full-stack environment (PostgreSQL, FastAPI backend, and Next.js frontend) with a single command:

```bash
docker compose up --build
```

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **Backend Health Check:** [http://localhost:8000/api/v1/health/](http://localhost:8000/api/v1/health/)

---

### Option 3: Deploy to Vercel (Unified Multi-Service)

This repository includes a root [vercel.json](file:///C:/ScamShield/vercel.json) that deploys the Next.js frontend and FastAPI backend together under a single Vercel project:

1. Import the repository on [Vercel](https://vercel.com).
2. Set the **Root Directory** to `.` (repository root).
3. The root `vercel.json` automatically:
   - Routes `/api/...` to the FastAPI backend.
   - Routes `/docs`, `/redoc`, and `/openapi.json` to FastAPI documentation.
   - Routes all other web traffic `/(.*)` to the Next.js frontend.
4. *(Optional)* Add a `POSTGRES_URL` in **Project Settings → Environment Variables** to enable persistent cloud storage (defaults to ephemeral `/tmp/scamshield.db` on serverless if omitted).

---

## 🧪 Testing & Validation

Run the automated test suite and frontend quality checks:

```bash
# Backend pytest suite (15 unit & integration tests)
cd backend
pytest -v

# Frontend linting
cd frontend
npm run lint

# Frontend production build
npm run build
```

---

## 🔒 Privacy & Safety Commitment

* **Zero-Storage Mode:** Users can uncheck the history toggle to execute 100% ephemeral in-memory scans.
* **Automated PII Scrubbing:** Names, emails, phone numbers, and financial details are redacted before persistence.
* **SSRF Immunity:** Backend never initiates outbound HTTP requests to user-submitted target URLs.
* **No Definite Fraud Labelling Without Proof:** Scam Kavach presents risk indicators and safe verification procedures, empowering students to make informed, cautious decisions.

---

## 📄 License

Distributed under the **MIT License**. Created for student safety and early-career cybersecurity defense.
