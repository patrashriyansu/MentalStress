// Mock data for MediVision AI
export const SYMPTOMS = [
  'Fever','Headache','Cough','Fatigue','Nausea','Vomiting','Diarrhea','Chest Pain',
  'Shortness of Breath','Dizziness','Back Pain','Abdominal Pain','Sore Throat',
  'Runny Nose','Body Aches','Loss of Appetite','Chills','Sweating','Rash','Joint Pain',
  'Muscle Pain','Swollen Lymph Nodes','Night Sweats','Weight Loss','Jaundice',
  'Blurred Vision','Hearing Loss','Numbness','Tingling','Constipation','Blood in Urine',
  'Painful Urination','Frequent Urination','Dark Urine','Itching','Dry Mouth',
  'Excessive Thirst','Frequent Hunger','Irregular Heartbeat','Swollen Legs',
  'High Blood Pressure','Pale Skin','Bruising','Hair Loss','Mood Swings',
  'Anxiety','Depression','Insomnia','Memory Loss','Confusion',
];

export const DISEASES = [
  { name: 'Dengue Fever', symptoms: ['Fever','Headache','Body Aches','Rash','Fatigue'], severity: 'High', confidence: 91, specialty: 'General Medicine' },
  { name: 'Common Cold', symptoms: ['Runny Nose','Sore Throat','Cough','Fatigue'], severity: 'Low', confidence: 95, specialty: 'General Medicine' },
  { name: 'Pneumonia', symptoms: ['Cough','Fever','Shortness of Breath','Chest Pain','Fatigue'], severity: 'High', confidence: 87, specialty: 'Pulmonology' },
  { name: 'Diabetes Type 2', symptoms: ['Excessive Thirst','Frequent Urination','Fatigue','Blurred Vision','Weight Loss'], severity: 'Medium', confidence: 89, specialty: 'Endocrinology' },
  { name: 'Hypertension', symptoms: ['Headache','Dizziness','Chest Pain','Shortness of Breath'], severity: 'Medium', confidence: 84, specialty: 'Cardiology' },
  { name: 'Malaria', symptoms: ['Fever','Chills','Sweating','Headache','Muscle Pain','Nausea'], severity: 'High', confidence: 88, specialty: 'Infectious Disease' },
  { name: 'Typhoid', symptoms: ['Fever','Abdominal Pain','Headache','Fatigue','Constipation','Loss of Appetite'], severity: 'High', confidence: 86, specialty: 'General Medicine' },
  { name: 'COVID-19', symptoms: ['Fever','Cough','Fatigue','Shortness of Breath','Body Aches','Loss of Appetite'], severity: 'High', confidence: 92, specialty: 'General Medicine' },
  { name: 'Heart Disease', symptoms: ['Chest Pain','Shortness of Breath','Irregular Heartbeat','Fatigue','Swollen Legs'], severity: 'Critical', confidence: 83, specialty: 'Cardiology' },
  { name: 'Migraine', symptoms: ['Headache','Nausea','Blurred Vision','Dizziness'], severity: 'Medium', confidence: 94, specialty: 'Neurology' },
  { name: 'Gastritis', symptoms: ['Abdominal Pain','Nausea','Vomiting','Loss of Appetite'], severity: 'Low', confidence: 90, specialty: 'Gastroenterology' },
  { name: 'Anemia', symptoms: ['Fatigue','Pale Skin','Dizziness','Shortness of Breath','Headache'], severity: 'Medium', confidence: 88, specialty: 'Hematology' },
];

export const DOCTORS = [
  { id: 1, name: 'Dr. Arjun Sharma', specialty: 'Cardiology', hospital: 'Apollo Hospital', rating: 4.9, experience: 15, fee: 800, available: true, image: null, nextAvailable: 'Today 3:00 PM' },
  { id: 2, name: 'Dr. Priya Nair', specialty: 'Neurology', hospital: 'Fortis Hospital', rating: 4.8, experience: 12, fee: 700, available: true, image: null, nextAvailable: 'Today 5:00 PM' },
  { id: 3, name: 'Dr. Rahul Gupta', specialty: 'Pulmonology', hospital: 'AIIMS', rating: 4.7, experience: 18, fee: 1000, available: false, image: null, nextAvailable: 'Tomorrow 10:00 AM' },
  { id: 4, name: 'Dr. Meena Patel', specialty: 'Endocrinology', hospital: 'Max Hospital', rating: 4.9, experience: 10, fee: 650, available: true, image: null, nextAvailable: 'Today 4:30 PM' },
  { id: 5, name: 'Dr. Vikram Singh', specialty: 'Orthopedics', hospital: 'Medanta', rating: 4.6, experience: 20, fee: 900, available: true, image: null, nextAvailable: 'Today 6:00 PM' },
  { id: 6, name: 'Dr. Anita Roy', specialty: 'Dermatology', hospital: 'Apollo Hospital', rating: 4.8, experience: 8, fee: 600, available: true, image: null, nextAvailable: 'Tomorrow 11:00 AM' },
  { id: 7, name: 'Dr. Suresh Mehta', specialty: 'Gastroenterology', hospital: 'Fortis Hospital', rating: 4.7, experience: 14, fee: 750, available: true, image: null, nextAvailable: 'Today 7:00 PM' },
  { id: 8, name: 'Dr. Kavya Reddy', specialty: 'Psychiatry', hospital: 'NIMHANS', rating: 4.9, experience: 11, fee: 700, available: true, image: null, nextAvailable: 'Tomorrow 9:00 AM' },
];

export const HOSPITALS = [
  { id: 1, name: 'Apollo Hospital', address: 'Sarita Vihar, New Delhi', lat: 28.6139, lng: 77.2090, distance: 1.2, rating: 4.8, emergency: true, icu: true, ambulance: true, specialties: ['Cardiology','Neurology','Orthopedics'], open: true, beds: 45 },
  { id: 2, name: 'Fortis Hospital', address: 'Shalimar Bagh, New Delhi', lat: 28.6200, lng: 77.2150, distance: 2.3, rating: 4.7, emergency: true, icu: true, ambulance: true, specialties: ['Oncology','Nephrology'], open: true, beds: 30 },
  { id: 3, name: 'AIIMS Delhi', address: 'Ansari Nagar, New Delhi', lat: 28.5672, lng: 77.2100, distance: 3.1, rating: 4.9, emergency: true, icu: true, ambulance: true, specialties: ['All Specialties'], open: true, beds: 120 },
  { id: 4, name: 'Max Hospital', address: 'Patparganj, New Delhi', lat: 28.6300, lng: 77.2200, distance: 4.0, rating: 4.6, emergency: true, icu: false, ambulance: true, specialties: ['Pediatrics','Gynecology'], open: true, beds: 20 },
  { id: 5, name: 'Safdarjung Hospital', address: 'Ring Road, New Delhi', lat: 28.5700, lng: 77.2000, distance: 2.8, rating: 4.4, emergency: true, icu: true, ambulance: false, specialties: ['General Medicine'], open: true, beds: 60 },
];


export const PHARMACIES = [
  { id: 1, name: 'MedPlus Pharmacy', lat: 28.6150, lng: 77.2100, distance: 0.8, open24: true, delivery: true, stock: 98 },
  { id: 2, name: 'Apollo Pharmacy', lat: 28.6180, lng: 77.2180, distance: 1.5, open24: true, delivery: true, stock: 95 },
  { id: 3, name: 'Wellness Forever', lat: 28.6120, lng: 77.2050, distance: 0.5, open24: false, delivery: false, stock: 87 },
  { id: 4, name: 'Jan Aushadhi Store', lat: 28.6080, lng: 77.2120, distance: 1.1, open24: false, delivery: false, stock: 75 },
];

export const MEDICINES = [
  { name: 'Paracetamol', type: 'OTC', dosage: '500mg every 6 hours', forSymptom: ['Fever','Headache','Body Aches'], precautions: 'Do not exceed 4g/day. Avoid alcohol.', price: 15 },
  { name: 'Cetirizine', type: 'OTC', dosage: '10mg once daily', forSymptom: ['Runny Nose','Itching','Rash'], precautions: 'May cause drowsiness. Avoid driving.', price: 25 },
  { name: 'Antacid (Gelusil)', type: 'OTC', dosage: '2 tablets after meals', forSymptom: ['Abdominal Pain','Nausea','Vomiting'], precautions: 'Take 1 hour after meals.', price: 40 },
  { name: 'ORS Sachet', type: 'OTC', dosage: '1 sachet in 1L water', forSymptom: ['Diarrhea','Vomiting'], precautions: 'Keep refrigerated after mixing.', price: 10 },
  { name: 'Vitamin C', type: 'OTC', dosage: '500mg once daily', forSymptom: ['Fatigue','Common Cold'], precautions: 'Safe for long-term use.', price: 80 },
  { name: 'Ibuprofen', type: 'OTC', dosage: '400mg every 8 hours with food', forSymptom: ['Joint Pain','Muscle Pain','Headache'], precautions: 'Avoid on empty stomach. Not for kidney patients.', price: 30 },
];

export const SPECIALTY_MAP = {
  'Cardiology': ['Chest Pain','Irregular Heartbeat','Shortness of Breath','Swollen Legs'],
  'Neurology': ['Headache','Dizziness','Numbness','Memory Loss','Confusion'],
  'Pulmonology': ['Cough','Shortness of Breath','Chest Pain'],
  'Endocrinology': ['Excessive Thirst','Frequent Urination','Weight Loss','Fatigue'],
  'Orthopedics': ['Joint Pain','Back Pain','Swollen Legs'],
  'Dermatology': ['Rash','Itching','Hair Loss'],
  'Gastroenterology': ['Abdominal Pain','Nausea','Vomiting','Diarrhea','Constipation'],
  'Psychiatry': ['Anxiety','Depression','Insomnia','Mood Swings'],
  'General Medicine': ['Fever','Fatigue','Body Aches','Sore Throat'],
};

export const HEALTH_ANALYTICS = {
  bloodPressure: [
    { date: 'Jan', systolic: 125, diastolic: 82 },
    { date: 'Feb', systolic: 122, diastolic: 80 },
    { date: 'Mar', systolic: 128, diastolic: 84 },
    { date: 'Apr', systolic: 118, diastolic: 78 },
    { date: 'May', systolic: 120, diastolic: 80 },
    { date: 'Jun', systolic: 115, diastolic: 75 },
  ],
  bloodSugar: [
    { date: 'Mon', fasting: 95, postMeal: 140 },
    { date: 'Tue', fasting: 92, postMeal: 135 },
    { date: 'Wed', fasting: 98, postMeal: 145 },
    { date: 'Thu', fasting: 90, postMeal: 130 },
    { date: 'Fri', fasting: 94, postMeal: 138 },
    { date: 'Sat', fasting: 96, postMeal: 142 },
    { date: 'Sun', fasting: 91, postMeal: 132 },
  ],
  sleep: [
    { day: 'Mon', hours: 7.5 }, { day: 'Tue', hours: 6.5 }, { day: 'Wed', hours: 8 },
    { day: 'Thu', hours: 7 }, { day: 'Fri', hours: 6 }, { day: 'Sat', hours: 9 }, { day: 'Sun', hours: 8.5 },
  ],
  calories: { burned: 1850, intake: 2200, goal: 2000 },
};

export const CHAT_RESPONSES = {
  'chest pain': {
    response: "I understand you're experiencing chest pain. This can sometimes indicate serious conditions. Are you also experiencing any of the following?\n\n• Sweating or cold sweat\n• Shortness of breath\n• Pain radiating to arm or jaw\n• Nausea or dizziness\n\n⚠️ If YES to multiple symptoms — please call emergency services immediately.",
    followUp: ['Yes, I have multiple symptoms', 'No, just chest pain', 'It\'s mild pain after eating'],
  },
  'fever': {
    response: "A fever can have many causes. Let me help narrow it down. How high is your temperature?\n\n• Below 99°F — Low-grade fever\n• 99-101°F — Moderate fever\n• Above 102°F — High fever\n\nAlso, how long have you had the fever?",
    followUp: ['Less than 24 hours', '2-3 days', 'More than a week'],
  },
  'headache': {
    response: "Headaches can vary widely. To help identify the cause, can you describe the pain?\n\n• Throbbing on one side → Possible Migraine\n• Band-like pressure → Tension headache\n• Sudden severe pain → Needs immediate attention\n• With fever → Possible infection\n\nHave you taken any pain medication?",
    followUp: ['Yes, no relief', 'Yes, partial relief', 'No medication yet'],
  },
  default: {
    response: "Thank you for sharing your symptoms. Based on what you've described, I'll help you understand possible causes and next steps. Could you tell me:\n\n1. How long have you had these symptoms?\n2. Any recent travel or illness exposure?\n3. Do you have any known medical conditions?\n\nThe more details you share, the better I can assist you. Remember — always consult a qualified doctor for a proper diagnosis.",
    followUp: ['Less than a day', '2-7 days', 'More than a week'],
  },
};
