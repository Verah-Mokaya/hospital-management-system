from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    name = Column(String)
    role = Column(String)  # admin, doctor, nurse, receptionist, attendant, finance, lab, cleaner
    first_login = Column(Boolean, default=True)
    password_changed_at = Column(TIMESTAMP, default=datetime.utcnow)
    password_expires_at = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

    employees = relationship("Employee", back_populates="user")
    appointments = relationship("Appointment", back_populates="doctor")


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    phone = Column(String)
    salary = Column(Float)
    status = Column(String, default="active")  # active, inactive
    hire_date = Column(TIMESTAMP, default=datetime.utcnow)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user = relationship("User", back_populates="employees")
    clock_records = relationship("ClockRecord", back_populates="employee")
    payment_requests = relationship("PaymentRequest", back_populates="employee")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    age = Column(Integer)
    gender = Column(String)
    medical_history = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

    appointments = relationship("Appointment", back_populates="patient")
    lab_records = relationship("LabRecord", back_populates="patient")
    medical_records = relationship("MedicalRecord", back_populates="patient")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"))
    appointment_date = Column(TIMESTAMP)
    appointment_time = Column(String)
    status = Column(String, default="pending")  # pending, confirmed, completed, cancelled
    reason = Column(String)
    notes = Column(Text)
    reminder_sent = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("User", back_populates="appointments")


class ClockRecord(Base):
    __tablename__ = "clock_records"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    clock_in_time = Column(TIMESTAMP)
    clock_out_time = Column(TIMESTAMP, nullable=True)
    worked_hours = Column(Float, default=0)
    overtime_hours = Column(Float, default=0)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="clock_records")


class PaymentRequest(Base):
    __tablename__ = "payment_requests"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    base_salary = Column(Float)
    overtime_pay = Column(Float, default=0)
    total_amount = Column(Float)
    status = Column(String, default="pending")  # pending, approved, rejected, paid
    month = Column(String)
    notes = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="payment_requests")


class LabRecord(Base):
    __tablename__ = "lab_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    test_name = Column(String)
    test_type = Column(String)
    result = Column(Text)
    status = Column(String, default="pending")  # pending, completed
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="lab_records")


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    diagnosis = Column(String)
    treatment = Column(Text)
    prescription = Column(Text)
    notes = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="medical_records")


class Pharmacy(Base):
    __tablename__ = "pharmacy"

    id = Column(Integer, primary_key=True, index=True)
    medicine_name = Column(String)
    quantity = Column(Integer)
    unit_price = Column(Float)
    expiry_date = Column(TIMESTAMP)
    status = Column(String, default="available")  # available, out_of_stock, expired
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String)
    category = Column(String)  # medical_supplies, equipment, cleaning_supplies
    quantity = Column(Integer)
    unit_price = Column(Float)
    reorder_level = Column(Integer)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


class CleaningLog(Base):
    __tablename__ = "cleaning_logs"

    id = Column(Integer, primary_key=True, index=True)
    cleaner_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    area_type = Column(String)  # washroom, ward, common_area
    area_name = Column(String)
    cleaning_date = Column(TIMESTAMP)
    duration_minutes = Column(Integer)
    status = Column(String, default="completed")  # pending, in_progress, completed
    notes = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=True)
    reminder_type = Column(String)  # appointment, medication, followup
    message = Column(Text)
    scheduled_time = Column(TIMESTAMP)
    sent = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
