# API Documentation - MediCare+ Backend

## Base URL

- Development: `http://localhost:5000/api/v1`
- Production: `https://your-api-domain.com/api/v1`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    /* resource data */
  },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

---

## Auth Endpoints

### 1. Register

**POST** `/auth/register`

**Description**: Create a new user account

**Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "patient"
}
```

**Response**:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

**Status Codes**: 201 Created, 400 Bad Request, 409 Conflict

---

### 2. Login

**POST** `/auth/login`

**Description**: Authenticate user and get JWT token

**Body**:

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response**:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

**Status Codes**: 200 OK, 401 Unauthorized, 404 Not Found

---

## Appointment Endpoints

### 1. Book Appointment

**POST** `/appointments`

**Protected**: Yes (Role: patient)

**Description**: Create a new appointment

**Body**:

```json
{
  "doctor": "507f1f77bcf86cd799439012",
  "date": "2024-03-15",
  "timeSlot": "10:00",
  "duration": 30,
  "reason": "Regular checkup",
  "visitType": "First Consultation",
  "notes": "Please bring recent blood reports"
}
```

**Validation**:

- Doctor must exist
- Date cannot be in the past
- Time slot must not have conflicts
- Patient cannot have multiple appointments on same date with same doctor

**Response**:

```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "patient": { "id": "...", "name": "John Doe" },
    "doctor": { "id": "...", "name": "Dr. Smith" },
    "date": "2024-03-15T00:00:00Z",
    "timeSlot": "10:00",
    "endTime": "10:30",
    "status": "pending",
    "visitType": "First Consultation"
  }
}
```

**Status Codes**: 201 Created, 400 Bad Request, 404 Not Found, 409 Conflict

---

### 2. Get Available Slots

**GET** `/appointments/doctor/:doctorId/available-slots?date=2024-03-15`

**Protected**: Yes

**Description**: Get available appointment slots for a doctor on specific date

**Query Parameters**:

- `date` (required): Date in YYYY-MM-DD format

**Response**:

```json
{
  "success": true,
  "date": "2024-03-15",
  "availableSlots": [
    "09:00",
    "09:30",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "14:30",
    "15:00"
  ],
  "totalSlots": 8
}
```

**Status Codes**: 200 OK, 400 Bad Request, 404 Not Found

---

### 3. Get Patient Appointments

**GET** `/appointments/patient/:patientId`

**Protected**: Yes

**Description**: Get all appointments for a patient

**Response**:

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "507f1f77bcf86cd799439013",
      "patient": { "id": "...", "name": "John Doe" },
      "doctor": {
        "id": "...",
        "name": "Dr. Smith",
        "specialization": "Cardiology"
      },
      "date": "2024-03-15T00:00:00Z",
      "timeSlot": "10:00",
      "status": "confirmed",
      "reason": "Regular checkup",
      "createdAt": "2024-03-01T10:00:00Z"
    }
  ]
}
```

**Status Codes**: 200 OK, 401 Unauthorized

---

### 4. Get Doctor Appointments

**GET** `/appointments/doctor/:doctorId`

**Protected**: Yes (Role: doctor, admin)

**Description**: Get all appointments for a doctor

**Response**: Similar to patient appointments but filtered by doctor

**Status Codes**: 200 OK, 401 Unauthorized

---

### 5. Update Appointment Status

**PUT** `/appointments/:id`

**Protected**: Yes

**Description**: Update appointment status with proper state transitions

**Valid Transitions**:

- `pending` → `confirmed`, `cancelled`, `no-show`
- `confirmed` → `in-progress`, `cancelled`, `no-show`
- `in-progress` → `completed`, `cancelled`
- `completed` → (no transitions)
- `cancelled` → (no transitions)

**Body**:

```json
{
  "status": "confirmed",
  "cancellationReason": "Not applicable",
  "notes": "Patient arrived 5 minutes early"
}
```

**Notes**:

- Patients can only cancel appointments
- Cancellation reason is required for cancelled status
- Doctors/admins can change other status values

**Response**:

```json
{
  "success": true,
  "message": "Appointment status updated to confirmed",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "status": "confirmed",
    "checkedInAt": null,
    "actualStartTime": null
  }
}
```

**Status Codes**: 200 OK, 400 Bad Request, 401 Unauthorized, 404 Not Found

---

### 6. Reschedule Appointment

**PUT** `/appointments/:id/reschedule`

**Protected**: Yes

**Description**: Change appointment date and time

**Body**:

```json
{
  "date": "2024-03-20",
  "timeSlot": "14:00",
  "duration": 30
}
```

**Validations**:

- Only pending or confirmed appointments can be rescheduled
- New date must be in the future
- New time slot must not conflict with other appointments

**Response**: Updated appointment object

**Status Codes**: 200 OK, 400 Bad Request, 409 Conflict

---

### 7. Delete Appointment

**DELETE** `/appointments/:id`

**Protected**: Yes (Role: patient, admin)

**Description**: Delete pending appointments (soft delete)

**Notes**: Only pending appointments can be deleted. Use status update for cancellations.

**Response**:

```json
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```

**Status Codes**: 200 OK, 400 Bad Request, 401 Unauthorized, 404 Not Found

---

### 8. Get Appointment Details

**GET** `/appointments/:id`

**Protected**: Yes

**Description**: Get complete appointment details

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "patient": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "gender": "Male"
    },
    "doctor": {
      "id": "...",
      "name": "Dr. Smith",
      "specialization": "Cardiology",
      "experience": 10,
      "rating": 4.8
    },
    "date": "2024-03-15T00:00:00Z",
    "timeSlot": "10:00",
    "endTime": "10:30",
    "status": "confirmed",
    "visitType": "First Consultation",
    "reason": "Regular checkup",
    "notes": "Patient history: Hypertension",
    "checkedIn": false,
    "checkedInAt": null,
    "actualStartTime": null,
    "actualEndTime": null,
    "createdAt": "2024-03-01T10:00:00Z",
    "updatedAt": "2024-03-05T10:00:00Z"
  }
}
```

**Status Codes**: 200 OK, 401 Unauthorized, 404 Not Found

---

## AI Endpoints

### 1. Analyze Symptoms

**POST** `/ai/symptoms`

**Protected**: Yes

**Description**: AI analysis of patient symptoms

**Body**:

```json
{
  "symptoms": ["fever", "cough", "fatigue"],
  "patientHistory": {
    "age": 30,
    "gender": "Male",
    "existingConditions": ["Hypertension"]
  }
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "possibleConditions": [
      {
        "name": "Common Cold",
        "probability": "high",
        "description": "Viral infection with respiratory symptoms"
      }
    ],
    "urgencyLevel": "Medium",
    "recommendedSpecialist": "General Physician",
    "explanation": "Symptoms suggest viral respiratory infection",
    "immediateActions": ["Rest well", "Stay hydrated", "Monitor temperature"],
    "warningSignsToWatch": [
      "High fever (>102°F)",
      "Difficulty breathing",
      "Chest pain"
    ]
  }
}
```

**Status Codes**: 200 OK, 400 Bad Request

---

### 2. Summarize Medical Report

**POST** `/ai/report-summary`

**Protected**: Yes

**Description**: AI summarization of medical reports

**Body**:

```json
{
  "reportText": "Blood Test Results: WBC 7.2 (Normal), RBC 4.8 (Normal), Hemoglobin 14 g/dL (Normal)...",
  "reportType": "blood-test"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "summary": "Overall blood work is within normal ranges",
    "keyFindings": [
      "Normal white blood cell count",
      "Normal hemoglobin levels"
    ],
    "abnormalValues": [],
    "diagnosis": "No abnormalities detected",
    "recommendations": [
      "Continue regular health monitoring",
      "Maintain healthy diet and exercise"
    ],
    "suggestedSpecialist": "General Physician",
    "riskLevel": "Low",
    "nextSteps": ["Schedule routine checkup in 6 months"]
  }
}
```

**Status Codes**: 200 OK, 400 Bad Request

---

### 3. Medical Chatbot

**POST** `/ai/chat`

**Protected**: Yes

**Description**: AI medical assistant conversation

**Body**:

```json
{
  "message": "How can I lower my cholesterol naturally?",
  "conversationHistory": []
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "reply": "To lower cholesterol naturally, you can: 1) Increase fiber intake through whole grains and fruits 2) Reduce saturated fat consumption 3) Exercise regularly 4) Maintain healthy weight. However, please consult with your doctor about your specific situation.",
    "suggestedAction": {
      "type": "FIND_DOCTOR",
      "label": "Find Cardiologist",
      "route": "/doctors"
    },
    "timestamp": "2024-03-15T10:30:00Z"
  }
}
```

**Status Codes**: 200 OK, 400 Bad Request

---

## File Upload Endpoints

### 1. Upload Medical Report

**POST** `/uploads/report`

**Protected**: Yes

**Description**: Upload medical report or document

**Content-Type**: multipart/form-data

**Form Data**:

- `file`: PDF or Image file (max 10MB)
- `reportType`: Document type (e.g., "lab-report", "xray")

**Response**:

```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "medicare/reports/...",
    "filename": "bloodwork_march.pdf",
    "size": 1024000
  }
}
```

**Status Codes**: 201 Created, 400 Bad Request, 413 Payload Too Large

---

### 2. Upload Prescription

**POST** `/uploads/prescription`

**Protected**: Yes (Role: doctor, admin)

**Description**: Upload prescription document

**Response**: Similar to report upload

---

### 3. Upload Profile Image

**POST** `/uploads/profile`

**Protected**: Yes

**Description**: Upload user profile picture

**Limits**: Max 5MB, auto-optimized

**Response**: Image URL and metadata

---

### 4. Delete File

**DELETE** `/uploads/:publicId`

**Protected**: Yes

**Description**: Delete file from Cloudinary

**Body**: Empty

**Response**:

```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## Doctor Endpoints

### 1. Get All Doctors

**GET** `/doctors?specialization=Cardiology&rating=4&page=1&limit=10`

**Protected**: No (Public endpoint)

**Query Parameters**:

- `specialization`: Filter by specialty (optional)
- `rating`: Minimum rating (optional)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**Response**:

```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Dr. Smith",
      "specialization": "Cardiology",
      "experience": 10,
      "rating": 4.8,
      "availableSlots": ["09:00", "10:00", "14:00"]
    }
  ]
}
```

---

## Error Codes

| Code                | Status | Description                         |
| ------------------- | ------ | ----------------------------------- |
| INVALID_CREDENTIALS | 401    | Email or password is incorrect      |
| TOKEN_EXPIRED       | 401    | JWT token has expired               |
| UNAUTHORIZED        | 401    | User not authorized for this action |
| NOT_FOUND           | 404    | Resource not found                  |
| CONFLICT            | 409    | Double-booking or data conflict     |
| VALIDATION_ERROR    | 400    | Invalid request data                |
| SERVER_ERROR        | 500    | Internal server error               |

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Error Response**: 429 Too Many Requests

---

## Pagination

Standard pagination for list endpoints:

**Query Parameters**:

- `page`: Page number (starts from 1)
- `limit`: Items per page (default: 10, max: 50)
- `sort`: Sort field and order (e.g., `-createdAt`, `name`)

**Response Metadata**:

```json
{
  "success": true,
  "count": 50,
  "total": 125,
  "page": 1,
  "pages": 3,
  "data": []
}
```

---

## Version History

- **v1.0.0** (2024-03): Initial release with all core features

---

**Last Updated**: March 2024
**API Version**: 1.0.0
