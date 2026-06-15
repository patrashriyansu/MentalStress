# MediVision AI — API Documentation

## Base URL
- **Frontend**: `http://localhost:5173`
- **Backend (FastAPI)**: `http://localhost:8000`
- **API Docs (Swagger)**: `http://localhost:8000/docs`

---

## Authentication

### POST `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "patient"
}
```
**Response:** JWT token + user object

### POST `/api/auth/register`
```json
{
  "name": "Riya Sharma",
  "email": "riya@example.com",
  "password": "password123",
  "phone": "+91 9876543210",
  "role": "patient"
}
```

---

## Disease Prediction

### POST `/api/predict/disease`
```json
{
  "symptoms": ["Fever", "Headache", "Body Aches"],
  "patientAge": 28,
  "patientGender": "female"
}
```
**Response:**
```json
{
  "predictions": [
    { "disease": "Dengue Fever", "confidence": 91.2, "severity": "High" }
  ],
  "model_accuracy": 94.2,
  "processing_time_ms": 87
}
```

---

## Medical Image Analysis

### POST `/api/predict/image`
- **Content-Type:** `multipart/form-data`
- **Body:** `file` (image), `imageType` (xray|mri|ct|skin)

**Response:**
```json
{
  "findings": [
    { "condition": "Pneumonia", "probability": 23, "normal": false }
  ],
  "model": "CNN (ResNet-50)",
  "accuracy": 96.5
}
```

---

## Hospital Finder

### GET `/api/hospitals?lat={lat}&lng={lng}&radius={km}`
**Response:** List of nearby hospitals with emergency status, distance, rating

---

## Emergency SOS

### POST `/api/emergency/sos`
```json
{
  "lat": 28.6139,
  "lng": 77.2090,
  "userId": 1,
  "emergencyType": "cardiac"
}
```
**Response:** Ambulance dispatched, hospital notified, SMS sent

---

## Health Analytics

### GET `/api/analytics/{userId}`
Returns blood pressure trends, blood sugar data, sleep analysis

### GET `/api/health-score/{userId}`
Returns AI health score (0–100) with breakdown by category

---

## Running the Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Backend starts on **http://localhost:8000** with live Swagger docs at `/docs`.
