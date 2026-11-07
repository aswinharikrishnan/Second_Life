SecondLife ♻️📱

SecondLife is a collaborative used-smartphone decision support system aligned with UN SDG 12.5 (reducing e-waste through informed second-hand purchasing and repairability analysis).

This platform evaluates used smartphones using machine learning to determine their Fair Market Value (FMV) and provides actionable Buy / Negotiate / Pass recommendations to extend device lifecycles.

🏗️ Architecture Overview

The project is structured as a decoupled full-stack application.

1. Frontend (Next.js)

The frontend is a modern, high-performance web application built to consume the machine learning API and visualize the viability of second-hand devices.

Framework: Next.js (App Router) with TypeScript.

Styling: Tailwind CSS for a responsive, eco-tech aesthetic.

Visualizations: Recharts for comparing asking prices versus predicted fair values.

Key Features:

Decision Engine: Automatically calculates a verdict based on the XGBoost prediction (≤0.9× = Buy, ≤1.15× = Negotiate, >1.15× = Pass).

One-Click Testing: A built-in "Fill with Test Payload" button to instantly populate the 16-field form with sample data (e.g., Samsung Galaxy S23).

Health Polling: Automatically polls the backend /health endpoint every 15 seconds to display a live Online/Offline status.

2. Backend (FastAPI)

The backend is a lightweight, high-speed Python API designed to serve the machine learning models.

Framework: FastAPI (served via Uvicorn).

Data Validation: Pydantic models (16 specific fields matching the frontend inputs) ensuring strict type-safety and data validation before model inference.

Routing: Modular route structure (/predict/ for inference, /health/ for status).

CORS: Pre-configured to accept requests from http://localhost:3000 (the Next.js frontend).

3. Machine Learning (XGBoost)

The predictive engine running inside the FastAPI backend.

Preprocessor: secondlife_preprocessor.joblib (Scikit-learn pipeline for encoding categorical variables and scaling numerical inputs).

Model: secondlife_xgb.json (Trained XGBoost model to predict the INR resale price based on hardware specs, physical condition, and battery health).

🚀 Getting Started

To run the full application locally, you will need to run the Backend and the Frontend in two separate terminal windows.

Prerequisites

Python 3.8+ (for the backend)

Node.js (LTS) and npm (for the frontend)

Step 1: Start the Backend (FastAPI)

Open your first terminal and run the following commands:

# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate the virtual environment (Windows)
.\venv\Scripts\activate
# On Mac/Linux use:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Start the server
python -m uvicorn app.main:app --reload


The backend will now be running at http://127.0.0.1:8000.

Step 2: Start the Frontend (Next.js)

Open a second terminal window and run the following commands:

# 1. Navigate to the frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start the development server
npm run dev


The frontend will now be running at http://localhost:3000.

📁 Directory Structure

SecondLife-main/
│
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/routes/       # API endpoints (e.g., prediction.py)
│   │   ├── core/             # App configuration and CORS
│   │   ├── schemas/          # Pydantic validation models
│   │   ├── services/         # ML prediction logic wrapper
│   │   └── main.py           # FastAPI entry point
│   ├── ml/models/            # Serialized XGBoost & Joblib models
│   ├── tests/                # Pytest suites
│   ├── requirements.txt      # Python dependencies
│   └── test_payload.txt      # Sample JSON for testing
│
└── frontend/                 # Next.js Application
    ├── src/
    │   ├── app/              # Next.js App Router pages and layouts
    │   ├── components/       # Reusable UI (Form, Results, Charts)
    │   ├── lib/              # API fetch wrappers
    │   └── types/            # TypeScript interfaces matching Pydantic
    ├── package.json          # Node dependencies
    └── tailwind.config.js    # UI styling rules
