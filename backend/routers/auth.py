from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import models
import schemas
from utils import (
    hash_password,
    verify_password,
    create_access_token,
    validate_password,
    get_password_expiry_date,
)
from database import get_db

router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = 30


@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Admin creates new employee account"""
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the universal password
    hashed_password = hash_password("Pass@123")

    db_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        name=user.name,
        role=user.role,
        first_login=True,
        password_expires_at=get_password_expiry_date(),
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {
        "message": "Employee account created successfully",
        "user": schemas.UserResponse.from_orm(db_user),
        "universal_password": "Pass@123",
    }


@router.post("/login", response_model=schemas.TokenResponse)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """User login"""
    user = db.query(models.User).filter(models.User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Check password expiry
    from utils import is_password_expired

    if is_password_expired(user.password_expires_at):
        raise HTTPException(
            status_code=403,
            detail="Password expired. Please change your password.",
        )

    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id, "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": schemas.UserResponse.from_orm(user),
    }


@router.post("/change-password")
def change_password(
    password_change: schemas.PasswordChange,
    current_user_id: int,
    db: Session = Depends(get_db),
):
    """Change user password"""
    user = db.query(models.User).filter(models.User.id == current_user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify old password
    if not verify_password(password_change.old_password, user.password_hash):
        raise HTTPException(status_code=401, detail="Old password is incorrect")

    # Verify passwords match
    if password_change.new_password != password_change.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Validate new password
    is_valid, message = validate_password(password_change.new_password, user.name)
    if not is_valid:
        raise HTTPException(status_code=400, detail=message)

    # Update password
    user.password_hash = hash_password(password_change.new_password)
    user.first_login = False
    user.password_expires_at = get_password_expiry_date()
    user.password_changed_at = models.datetime.utcnow()

    db.commit()

    return {"message": "Password changed successfully"}


@router.post("/reset-password")
def reset_password(email: str, admin_id: int, db: Session = Depends(get_db)):
    """Admin resets employee password to universal password"""
    admin = db.query(models.User).filter(models.User.id == admin_id).first()

    if not admin or admin.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can reset passwords")

    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Reset to universal password
    user.password_hash = hash_password("Pass@123")
    user.first_login = True
    user.password_expires_at = get_password_expiry_date()

    db.commit()

    return {
        "message": "Password reset successfully",
        "universal_password": "Pass@123",
    }
