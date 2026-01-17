from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import get_db

router = APIRouter()


@router.post("/", response_model=schemas.ReminderResponse)
def create_reminder(reminder: schemas.ReminderCreate, db: Session = Depends(get_db)):
    """Create new reminder"""
    db_reminder = models.Reminder(**reminder.dict())
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder


@router.get("/", response_model=List[schemas.ReminderResponse])
def get_all_reminders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all reminders"""
    reminders = db.query(models.Reminder).offset(skip).limit(limit).all()
    return reminders


@router.get("/{reminder_id}", response_model=schemas.ReminderResponse)
def get_reminder(reminder_id: int, db: Session = Depends(get_db)):
    """Get reminder by ID"""
    reminder = db.query(models.Reminder).filter(models.Reminder.id == reminder_id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return reminder


@router.put("/{reminder_id}", response_model=schemas.ReminderResponse)
def update_reminder(
    reminder_id: int, reminder: schemas.ReminderResponse, db: Session = Depends(get_db)
):
    """Update reminder"""
    db_reminder = db.query(models.Reminder).filter(models.Reminder.id == reminder_id).first()
    if not db_reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")

    db_reminder.sent = reminder.sent
    db.commit()
    db.refresh(db_reminder)
    return db_reminder


@router.get("/pending/patient/{patient_id}", response_model=List[schemas.ReminderResponse])
def get_pending_patient_reminders(patient_id: int, db: Session = Depends(get_db)):
    """Get pending reminders for a patient"""
    reminders = (
        db.query(models.Reminder)
        .filter(
            models.Reminder.patient_id == patient_id,
            models.Reminder.sent == False,
        )
        .all()
    )
    return reminders


@router.post("/{reminder_id}/mark-sent")
def mark_reminder_sent(reminder_id: int, db: Session = Depends(get_db)):
    """Mark reminder as sent"""
    reminder = db.query(models.Reminder).filter(models.Reminder.id == reminder_id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")

    reminder.sent = True
    db.commit()
    return {"message": "Reminder marked as sent"}
