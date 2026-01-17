# Hospital Management System - FastAPI Backend

This is the FastAPI backend for the Hospital Management System with PostgreSQL database.

## Setup Instructions

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Database

Update `.env` file with your PostgreSQL connection:

```
DATABASE_URL=postgresql://username:password@localhost:5432/hospital_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Create Database

```bash
createdb hospital_db  # Or use your database management tool
```

### 5. Run the Server

```bash
python main.py
```

The server will run on `http://localhost:8000`

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new employee (Admin only)
- `POST /api/auth/login` - Login
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/reset-password` - Reset password (Admin only)

### Patients
- `POST /api/patients/register` - Register patient
- `GET /api/patients/` - Get all patients
- `GET /api/patients/{patient_id}` - Get patient
- `PUT /api/patients/{patient_id}` - Update patient
- `DELETE /api/patients/{patient_id}` - Delete patient

### Employees
- `POST /api/employees/clock-in` - Clock in
- `POST /api/employees/clock-out` - Clock out
- `GET /api/employees/clock-records/{employee_id}` - Get clock records
- `GET /api/employees/` - Get all employees
- `GET /api/employees/{employee_id}` - Get employee

### Appointments
- `POST /api/appointments/` - Create appointment
- `GET /api/appointments/` - Get all appointments
- `GET /api/appointments/{appointment_id}` - Get appointment
- `PUT /api/appointments/{appointment_id}` - Update appointment
- `DELETE /api/appointments/{appointment_id}` - Delete appointment

### Lab
- `POST /api/lab/records` - Create lab record
- `GET /api/lab/records` - Get all lab records
- `GET /api/lab/records/{record_id}` - Get lab record
- `PUT /api/lab/records/{record_id}` - Update lab record
- `GET /api/lab/patient/{patient_id}` - Get patient lab records

### Pharmacy
- `POST /api/pharmacy/` - Add medicine
- `GET /api/pharmacy/` - Get all medicines
- `GET /api/pharmacy/{medicine_id}` - Get medicine
- `PUT /api/pharmacy/{medicine_id}` - Update medicine
- `DELETE /api/pharmacy/{medicine_id}` - Delete medicine
- `GET /api/pharmacy/low-stock/alert` - Get low stock medicines

### Inventory
- `POST /api/inventory/` - Add item
- `GET /api/inventory/` - Get all items
- `GET /api/inventory/{item_id}` - Get item
- `PUT /api/inventory/{item_id}` - Update item
- `DELETE /api/inventory/{item_id}` - Delete item
- `GET /api/inventory/low-stock/alert` - Get low stock items

### Cleaning
- `POST /api/cleaning/logs` - Create cleaning log
- `GET /api/cleaning/logs` - Get all cleaning logs
- `GET /api/cleaning/logs/{log_id}` - Get cleaning log
- `PUT /api/cleaning/logs/{log_id}` - Update cleaning log
- `GET /api/cleaning/history/{cleaner_id}` - Get cleaner history

### Reminders
- `POST /api/reminders/` - Create reminder
- `GET /api/reminders/` - Get all reminders
- `GET /api/reminders/{reminder_id}` - Get reminder
- `PUT /api/reminders/{reminder_id}` - Update reminder
- `GET /api/reminders/pending/patient/{patient_id}` - Get pending reminders
- `POST /api/reminders/{reminder_id}/mark-sent` - Mark reminder as sent

## Features

- User authentication with JWT tokens
- Password management (expiry, reset, validation)
- Patient management
- Employee clock-in/out with overtime calculation
- Appointments scheduling
- Lab records management
- Pharmacy management with stock alerts
- Inventory management
- Cleaning logs and scheduling
- Appointment and medication reminders
- Role-based access control

## Database Schema

The database includes the following tables:
- users
- employees
- patients
- appointments
- clock_records
- payment_requests
- lab_records
- medical_records
- pharmacy
- inventory
- cleaning_logs
- reminders

## CORS Configuration

Update CORS settings in `main.py` to allow only your frontend domain in production:

```python
allow_origins=["https://yourdomain.com"]
```

## Deployment

To deploy to production:

1. Use a production ASGI server like Gunicorn + Uvicorn
2. Set up environment variables securely
3. Configure CORS for your domain
4. Use HTTPS
5. Set up database backups

Example with Gunicorn:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```
