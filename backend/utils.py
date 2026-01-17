import bcrypt
import jwt
from datetime import datetime, timedelta
import os
import re
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = os.getenv("ALGORITHM", "HS256")


def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()


def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.JWTError:
        return None


def generate_universal_password() -> str:
    """Generate universal password for new employees"""
    return "Pass@123"


def validate_password(password: str, employee_name: str) -> tuple[bool, str]:
    """
    Validate password against requirements:
    - At least 8 characters
    - At least 1 uppercase letter
    - At least 1 lowercase letter
    - At least 1 special character
    - Does not contain employee name
    """
    errors = []

    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")

    if not re.search(r"[A-Z]", password):
        errors.append("Password must contain at least one uppercase letter")

    if not re.search(r"[a-z]", password):
        errors.append("Password must contain at least one lowercase letter")

    if not re.search(r"[!@#$%^&*_+\-]", password):
        errors.append("Password must contain at least one special character")

    if employee_name.lower() in password.lower():
        errors.append("Password cannot contain your name")

    if errors:
        return False, "; ".join(errors)

    return True, "Password is valid"


def get_password_expiry_date() -> datetime:
    """Get password expiry date (30 days from now)"""
    return datetime.utcnow() + timedelta(days=30)


def is_password_expired(expiry_date: datetime) -> bool:
    """Check if password is expired"""
    return datetime.utcnow() > expiry_date


def get_days_until_expiry(expiry_date: datetime) -> int:
    """Get number of days until password expires"""
    delta = expiry_date - datetime.utcnow()
    return delta.days


def calculate_worked_hours(clock_in: datetime, clock_out: datetime) -> tuple[float, float]:
    """
    Calculate worked hours and overtime
    Returns (worked_hours, overtime_hours)
    """
    delta = clock_out - clock_in
    total_hours = delta.total_seconds() / 3600

    worked_hours = min(total_hours, 8)
    overtime_hours = max(0, total_hours - 8)

    return round(worked_hours, 2), round(overtime_hours, 2)
