# 🚀 Deployment Guide
## AI Papaya Disease Detection System

---

## Option 1: Local Development (Quickest)

### Step 1: Clone and set up environment
```bash
git clone https://github.com/yourname/papaya-disease-system.git
cd papaya-disease-system

# Create .env file in backend/
cat > backend/.env << EOF
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=postgresql://papaya_user:papaya_pass@localhost:5432/papaya_db
CORS_ORIGINS=http://localhost:5173
MODEL_PATH=../ml/models/efficientnetb0_papaya.h5
FLASK_DEBUG=1
EOF
```

### Step 2: PostgreSQL database
```bash
# Install PostgreSQL and create database
psql -U postgres << EOF
CREATE USER papaya_user WITH PASSWORD 'papaya_pass';
CREATE DATABASE papaya_db OWNER papaya_user;
GRANT ALL PRIVILEGES ON DATABASE papaya_db TO papaya_user;
EOF
```

### Step 3: Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
flask db upgrade          # Run migrations
python run.py             # Start on http://localhost:5000
```

### Step 4: Frontend
```bash
cd frontend
npm install
npm run dev               # Start on http://localhost:5173
```

### Step 5: Train or download model
```bash
# Option A: Train (requires dataset)
cd ml/training
python train.py --dataset_path ../data/papaya_dataset

# Option B: Download pre-trained (if available)
wget https://your-model-host/efficientnetb0_papaya.h5 -O ml/models/efficientnetb0_papaya.h5
```

---

## Option 2: Docker Compose (Recommended for Demo)

```bash
# Build and start all services
cd deployment/docker
docker-compose up --build -d

# Check logs
docker-compose logs -f backend

# Run database migrations
docker-compose exec backend flask db upgrade

# Access application
# Frontend: http://localhost
# Backend API: http://localhost:5000/api/health
```

---

## Option 3: AWS Deployment

### EC2 + RDS Setup
```bash
# 1. Launch EC2 instance (Ubuntu 22.04, t3.medium minimum)
# 2. Create RDS PostgreSQL 15 instance (db.t3.micro)
# 3. SSH into EC2

# Install Docker
sudo apt update && sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu

# Clone repository
git clone https://github.com/yourname/papaya-disease-system.git
cd papaya-disease-system/deployment/docker

# Update docker-compose.yml with:
# DATABASE_URL=postgresql://user:pass@your-rds-endpoint:5432/papaya_db

# Start services
docker-compose up -d

# Configure security groups:
# Port 80 (HTTP) - open to 0.0.0.0/0
# Port 443 (HTTPS) - open to 0.0.0.0/0
# Port 5432 (PostgreSQL) - only from EC2 security group
```

### SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com
# Certificates saved to /etc/letsencrypt/live/yourdomain.com/
```

---

## Option 4: Google Cloud Run (Serverless)

```bash
# Build and push backend
gcloud builds submit --tag gcr.io/PROJECT_ID/papaya-backend backend/
gcloud run deploy papaya-backend \
  --image gcr.io/PROJECT_ID/papaya-backend \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=postgresql://...

# Deploy frontend to Firebase Hosting
npm run build
firebase deploy --only hosting
```

---

## Environment Variables Reference

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| SECRET_KEY | ✅ | `openssl rand -hex 32` | Flask secret |
| JWT_SECRET_KEY | ✅ | `openssl rand -hex 32` | JWT signing |
| DATABASE_URL | ✅ | `postgresql://user:pass@host:5432/db` | PostgreSQL DSN |
| CORS_ORIGINS | ✅ | `https://yourdomain.com` | Comma-separated |
| MODEL_PATH | ✅ | `ml/models/efficientnetb0_papaya.h5` | H5 model file |
| UPLOAD_FOLDER | ❌ | `uploads` | Image storage |
| REPORT_DIR | ❌ | `reports` | PDF storage |
| FLASK_DEBUG | ❌ | `0` | Production: 0 |

---

## CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build and push Docker images
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker build -t yourname/papaya-backend backend/
          docker push yourname/papaya-backend
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ubuntu
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app/papaya-disease-system
            git pull
            docker-compose pull
            docker-compose up -d
```

---

## Performance Optimization

```python
# backend/app/ml/model_loader.py
# Enable TensorFlow GPU (if NVIDIA GPU available)
import tensorflow as tf
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    tf.config.experimental.set_memory_growth(gpus[0], True)
```

```bash
# Use TensorRT for 3x faster inference on NVIDIA
pip install tensorrt
trtexec --onnx=model.onnx --saveEngine=model.trt
```