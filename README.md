# ♻️ SecondLife

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

> A collaborative, machine-learning-powered decision support system designed to reduce e-waste and promote the circular economy (**UN SDG 12.5**).

SecondLife evaluates used smartphones via an XGBoost ML model to determine their Fair Market Value (FMV) and provides actionable **Buy / Negotiate / Pass** recommendations, extending device lifecycles.

---

## 🏗️ System Architecture

The application operates on a decoupled client-server architecture:

* **Frontend (Next.js 15):** A highly responsive, server-side rendered dashboard built with App Router, TypeScript, and Tailwind CSS. Features dynamic Recharts visualizations and a custom decision engine for instant hardware viability feedback.
* **Backend (FastAPI):** A high-throughput Python REST API handling data validation (via Pydantic) and inference.
* **Machine Learning Engine:** An integrated Scikit-learn preprocessing pipeline (`joblib`) and XGBoost predictive model (`json`) determining precise INR resale values based on live hardware conditions.

---

## ⚡ Local Development Guide

You will need **Node.js (LTS)** and **Python 3.8+** installed. Run the backend and frontend in **two separate terminal instances**.

### 1. Start the Backend API (Terminal 1)

The backend must be running for the frontend to successfully submit predictions.

```bash
# Navigate to the backend service
cd backend

# Initialize and activate the virtual environment
python -m venv venv
.\venv\Scripts\activate     # Windows
# source venv/bin/activate # Mac/Linux

# Install dependencies and start the Uvicorn server
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
📍 *API listening on: `http://127.0.0.1:8000`*

### 2. Start the Frontend Dashboard (Terminal 2)

```bash
# Navigate to the frontend workspace
cd frontend

# Install Node modules
npm install

# Boot the development server
npm run dev
```
📍 *Client listening on: `http://localhost:3000`*

---

## 📁 Workspace Structure

```text
SecondLife-main/
│
├── 🐍 backend/                   # FastAPI Service
│   ├── app/
│   │   ├── api/routes/           # API endpoints (e.g., prediction.py)
│   │   ├── core/                 # App configuration & CORS config
│   │   ├── schemas/              # Pydantic validation contracts
│   │   └── main.py               # Uvicorn entry point
│   ├── ml/models/                # Serialized XGBoost & Joblib ML models
│   └── requirements.txt          # Python dependency manifest
│
└── ⚛️ frontend/                  # Next.js Client
    ├── src/
    │   ├── app/                  # Route segments & layouts
    │   ├── components/           # Reusable UI (Forms, Result Cards, Charts)
    │   ├── lib/                  # Typed fetch wrappers & API utilities
    │   └── types/                # TS interfaces matching Backend schemas
    ├── package.json              # Node dependency manifest
    └── tailwind.config.js        # Design system configuration
```