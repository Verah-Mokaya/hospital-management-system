from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


# User/Auth Schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    first_login: bool
    password_expires_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class PasswordChange(BaseModel):
    old_password: str
    new_password: str
    confirm_password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# Employee Schemas
class EmployeeCreate(BaseModel):
    user_id: int
    phone: str
    salary: float


class EmployeeResponse(BaseModel):
    id: int
    user_id: int
    phone: str
    salary: float
    status: str
    hire_date: datetime

    class Config:
        from_attributes = True


# Patient Schemas
class PatientCreate(BaseModel):
    name: str
    email: str
    phone: str
    age: int
    gender: str
    medical_history: Optional[str] = None


class PatientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    medical_history: Optional[str] = None


class PatientResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    age: int
    gender: str
    medical_history: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Appointment Schemas
class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: datetime
    appointment_time: str
    reason: str
    notes: Optional[str] = None


class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_date: datetime
    appointment_time: str
    status: str
    reason: str
    notes: Optional[str]
    reminder_sent: bool

    class Config:
        from_attributes = True


# Clock Record Schemas
class ClockInRequest(BaseModel):
    employee_id: int


class ClockOutRequest(BaseModel):
    employee_id: int


class ClockRecordResponse(BaseModel):
    id: int
    employee_id: int
    clock_in_time: datetime
    clock_out_time: Optional[datetime]
    worked_hours: float
    overtime_hours: float

    class Config:
        from_attributes = True


# Payment Request Schemas
class PaymentRequestCreate(BaseModel):
    employee_id: int
    base_salary: float
    overtime_pay: Optional[float] = 0
    total_amount: float
    month: str
    notes: Optional[str] = None


class PaymentRequestUpdate(BaseModel):
    status: str


class PaymentRequestResponse(BaseModel):
    id: int
    employee_id: int
    base_salary: float
    overtime_pay: float
    total_amount: float
    status: str
    month: str
    notes: Optional[str]

    class Config:
        from_attributes = True


# Lab Record Schemas
class LabRecordCreate(BaseModel):
    patient_id: int
    test_name: str
    test_type: str
    result: Optional[str] = None


class LabRecordUpdate(BaseModel):
    result: Optional[str] = None
    status: Optional[str] = None


class LabRecordResponse(BaseModel):
    id: int
    patient_id: int
    test_name: str
    test_type: str
    result: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Pharmacy Schemas
class PharmacyCreate(BaseModel):
    medicine_name: str
    quantity: int
    unit_price: float
    expiry_date: datetime


class PharmacyUpdate(BaseModel):
    quantity: Optional[int] = None
    status: Optional[str] = None


class PharmacyResponse(BaseModel):
    id: int
    medicine_name: str
    quantity: int
    unit_price: float
    expiry_date: datetime
    status: str

    class Config:
        from_attributes = True


# Inventory Schemas
class InventoryCreate(BaseModel):
    item_name: str
    category: str
    quantity: int
    unit_price: float
    reorder_level: int


class InventoryUpdate(BaseModel):
    quantity: Optional[int] = None
    status: Optional[str] = None


class InventoryResponse(BaseModel):
    id: int
    item_name: str
    category: str
    quantity: int
    unit_price: float
    reorder_level: int

    class Config:
        from_attributes = True


# Cleaning Log Schemas
class CleaningLogCreate(BaseModel):
    cleaner_id: Optional[int] = None
    area_type: str
    area_name: str
    duration_minutes: int
    notes: Optional[str] = None


class CleaningLogUpdate(BaseModel):
    status: str


class CleaningLogResponse(BaseModel):
    id: int
    cleaner_id: Optional[int]
    area_type: str
    area_name: str
    status: str
    cleaning_date: datetime
    duration_minutes: int

    class Config:
        from_attributes = True


# Reminder Schemas
class ReminderCreate(BaseModel):
    patient_id: Optional[int] = None
    appointment_id: Optional[int] = None
    reminder_type: str
    message: str
    scheduled_time: datetime


class ReminderResponse(BaseModel):
    id: int
    patient_id: Optional[int]
    appointment_id: Optional[int]
    reminder_type: str
    message: str
    scheduled_time: datetime
    sent: bool

    class Config:
        from_attributes = True
