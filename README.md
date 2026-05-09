# 🌿 AI-Based Papaya Leaf Disease Detection & Prediction System

> Final Year Project | B.Tech/MCA Computer Science | Deep Learning + Full Stack Web App

---

## 📋 Project Overview

This system uses **Transfer Learning with EfficientNetB0** to detect and classify papaya leaf diseases from uploaded images. It provides real-time disease predictions, confidence scores, treatment recommendations, and analytics — all wrapped in a modern full-stack web application.

### 🎯 Problem Statement
Papaya farmers lose 30–40% of crops due to undetected diseases. Early detection using AI can save crops, reduce pesticide misuse, and increase yield.

### 💡 Solution
A web-based AI system that allows farmers to upload leaf images and instantly receive disease diagnosis, severity assessment, and treatment recommendations.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Tailwind CSS, Chart.js, React Router |
| Backend | Flask (Python 3.10+) + FastAPI |
| Database | PostgreSQL 15 + SQLAlchemy ORM |
| AI Model | TensorFlow 2.x, EfficientNetB0, Keras |
| Auth | JWT (JSON Web Tokens) |
| PDF | ReportLab |
| Deployment | Docker, Nginx, AWS/GCP |
| CI/CD | GitHub Actions |

---

## 📁 Complete Folder Structure

```
papaya-disease-system/
├── frontend/                          # React.js Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── SignupForm.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── FarmerDashboard.jsx
│   │   │   │   ├── PredictionHistory.jsx
│   │   │   │   └── AnalyticsCharts.jsx
│   │   │   ├── prediction/
│   │   │   │   ├── ImageUploader.jsx
│   │   │   │   ├── CameraCapture.jsx
│   │   │   │   ├── PredictionResult.jsx
│   │   │   │   └── TreatmentCard.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── UserManagement.jsx
│   │   │   └── common/
│   │   │       ├── Navbar.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       ├── ConfidenceBar.jsx
│   │   │       └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Predict.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Admin.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── usePrediction.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── predictionService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                           # Flask/FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── predict.py
│   │   │   ├── history.py
│   │   │   ├── analytics.py
│   │   │   ├── report.py
│   │   │   └── admin.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── prediction.py
│   │   │   └── disease.py
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── prediction_service.py
│   │   │   └── report_service.py
│   │   ├── ml/
│   │   │   ├── model_loader.py
│   │   │   └── preprocessor.py
│   │   └── utils/
│   │       ├── jwt_utils.py
│   │       └── validators.py
│   ├── migrations/
│   ├── tests/
│   ├── requirements.txt
│   └── run.py
│
├── ml/                                # ML Training Pipeline
│   ├── training/
│   │   ├── train.py
│   │   ├── evaluate.py
│   │   └── augmentation.py
│   ├── data/
│   │   └── dataset_prep.py
│   └── notebooks/
│       └── EfficientNetB0_Training.ipynb
│
├── deployment/
│   ├── docker/
│   │   ├── Dockerfile.frontend
│   │   ├── Dockerfile.backend
│   │   └── docker-compose.yml
│   ├── nginx/
│   │   └── nginx.conf
│   └── kubernetes/
│       └── k8s-deploy.yaml
│
└── docs/
    ├── API_DOCS.md
    ├── DATABASE_SCHEMA.md
    └── VIVA_GUIDE.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, Python 3.10+, PostgreSQL 15+, Docker (optional)

### 1. Clone & Setup
```bash
git clone https://github.com/yourname/papaya-disease-system.git
cd papaya-disease-system
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secret

# Initialize database
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Run backend
python run.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Train / Load Model
```bash
cd ml/training
python train.py --epochs 50 --dataset_path ../data/papaya_dataset
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | User registration | No |
| POST | /api/auth/login | User login | No |
| POST | /api/auth/refresh | Refresh JWT token | Yes |
| POST | /api/predict | Upload leaf image & get prediction | Yes |
| GET | /api/history | Get prediction history | Yes |
| GET | /api/history/{id} | Get single prediction | Yes |
| DELETE | /api/history/{id} | Delete prediction | Yes |
| GET | /api/analytics/summary | Disease statistics | Yes |
| GET | /api/analytics/trends | Monthly trends | Yes |
| GET | /api/report/pdf/{id} | Download PDF report | Yes |
| GET | /api/admin/users | List all users | Admin |
| PUT | /api/admin/users/{id} | Update user role | Admin |
| GET | /api/diseases | Get all disease info | Yes |

---

## 📊 Disease Classes

| # | Disease | Severity | Treatment Priority |
|---|---------|----------|--------------------|
| 0 | Healthy Leaf | None | None |
| 1 | Papaya Ring Spot Virus | High | Urgent |
| 2 | Powdery Mildew | Medium | Within 48h |
| 3 | Leaf Curl Disease | High | Urgent |
| 4 | Anthracnose | Medium | Within 72h |
| 5 | Phytophthora Blight | Critical | Immediate |
| 6 | Mosaic Virus | High | Urgent |
| 7 | Downy Mildew | Medium | Within 48h |
| 8 | Bacterial Spot | Medium | Within 72h |
| 9 | Cercospora Leaf Spot | Low | Monitoring |
| 10 | Yellow Crinkle Disease | High | Urgent |
| 11 | Nutrient Deficiency | Low | Supplementation |

---

## 🧠 Model Architecture

- **Base Model**: EfficientNetB0 (pretrained on ImageNet)
- **Input Size**: 224×224×3 RGB
- **Custom Head**: GlobalAveragePooling → Dense(256, ReLU) → Dropout(0.4) → Dense(12, Softmax)
- **Training**: 2-phase (frozen base → fine-tuned top layers)
- **Augmentation**: Rotation, flip, zoom, brightness, contrast
- **Target Accuracy**: 95%+

---

## 📄 License

MIT License — For Educational Use

## 👨‍💻 Author

Final Year Student | Department of Computer Science | 2024–2025