# Hospital Management System - Backend Setup Guide

This guide explains how to set up and run the FastAPI backend with PostgreSQL for the Hospital Management System.

## Quick Start with Docker

The easiest way to run the backend is using Docker and Docker Compose:

### Prerequisites
- Docker and Docker Compose installed
- Git

### Steps

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Build and run with Docker Compose**
```bash
docker-compose up -d
```

This will:
- Create and start a PostgreSQL database
- Build and run the FastAPI application
- Automatically create all database tables

3. **Verify the backend is running**
```bash
curl http://localhost:8000/health
```

You should see: `{"status":"ok"}`

4. **Access the API documentation**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Manual Setup (Without Docker)

### Prerequisites
- Python 3.10+
- PostgreSQL 14+
- pip

### Steps

1. **Create PostgreSQL Database**
```bash
psql -U postgres
CREATE DATABASE hospital_db;
CREATE USER hospital_user WITH PASSWORD 'hospital_password';
ALTER ROLE hospital_user SET client_encoding TO 'utf8';
ALTER ROLE hospital_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE hospital_user SET default_transaction_deferrable TO on;
ALTER ROLE hospital_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE hospital_db TO hospital_user;
\q
```

2. **Navigate to backend directory**
```bash
cd backend
```

3. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` and set:
```
DATABASE_URL=postgresql://hospital_user:hospital_password@localhost:5432/hospital_db
SECRET_KEY=your-secret-key-here-change-in-production
```

6. **Run the server**
```bash
python main.py
```

The server will start on `http://localhost:8000`

## Frontend Configuration

1. **Create `.env.local` in the frontend root**
```bash
cp .env.local.example .env.local
```

2. **Set the API URL**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Database Schema

The backend automatically creates all tables when it starts. Tables include:

- **users** - User authentication and authorization
- **employees** - Employee information
- **patients** - Patient registration and info
- **appointments** - Appointment scheduling
- **clock_records** - Employee time tracking
- **payment_requests** - Payroll management
- **lab_records** - Laboratory test records
- **medical_records** - Patient medical history
- **pharmacy** - Medicine inventory
- **inventory** - Medical supplies inventory
- **cleaning_logs** - Facility cleaning records
- **reminders** - Patient and appointment reminders

## API Testing

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"Admin@123"}'
```

**Get all patients:**
```bash
curl -X GET http://localhost:8000/api/patients/ \
  -H "Authorization: Bearer <your_token>"
```

### Using Swagger UI
Visit http://localhost:8000/docs and use the interactive interface

## Troubleshooting

### "Connection refused" error
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env` file

### "ModuleNotFoundError"
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

### Port 8000 already in use
- Kill the process: `lsof -ti :8000 | xargs kill -9`
- Or use a different port in `main.py`

### Database migration issues
- Delete the database: `dropdb hospital_db`
- Recreate: `createdb hospital_db`
- Run the backend again

## Deployment

For production deployment:

1. **Use production database** (AWS RDS, Heroku Postgres, etc.)
2. **Set strong SECRET_KEY**
3. **Update CORS origins** in main.py
4. **Use HTTPS**
5. **Use production ASGI server** (Gunicorn)

Example with Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

## Docker Production Setup

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'
services:
  api:
    image: hospital-api:latest
    environment:
      DATABASE_URL: postgresql://user:password@your-db-host:5432/hospital_db
      SECRET_KEY: your-production-secret-key
    ports:
      - "8000:8000"
```

## Next Steps

1. Verify backend is running
2. Update frontend `.env.local` with API URL
3. Test login in the frontend
4. Create sample data through admin dashboard
