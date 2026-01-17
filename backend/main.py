from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import auth, patients, employees, appointments, lab, pharmacy, inventory, cleaning, reminders

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hospital Management System", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])
app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(lab.router, prefix="/api/lab", tags=["Lab"])
app.include_router(pharmacy.router, prefix="/api/pharmacy", tags=["Pharmacy"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(cleaning.router, prefix="/api/cleaning", tags=["Cleaning"])
app.include_router(reminders.router, prefix="/api/reminders", tags=["Reminders"])


@app.get("/")
def read_root():
    return {"message": "Hospital Management System API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
