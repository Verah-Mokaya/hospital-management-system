from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import get_db

router = APIRouter()


@router.post("/logs", response_model=schemas.CleaningLogResponse)
def create_cleaning_log(log: schemas.CleaningLogCreate, db: Session = Depends(get_db)):
    """Create new cleaning log"""
    db_log = models.CleaningLog(
        cleaner_id=log.cleaner_id,
        area_type=log.area_type,
        area_name=log.area_name,
        cleaning_date=models.datetime.utcnow(),
        duration_minutes=log.duration_minutes,
        notes=log.notes,
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


@router.get("/logs", response_model=List[schemas.CleaningLogResponse])
def get_all_cleaning_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all cleaning logs"""
    logs = db.query(models.CleaningLog).offset(skip).limit(limit).all()
    return logs


@router.get("/logs/{log_id}", response_model=schemas.CleaningLogResponse)
def get_cleaning_log(log_id: int, db: Session = Depends(get_db)):
    """Get cleaning log by ID"""
    log = db.query(models.CleaningLog).filter(models.CleaningLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Cleaning log not found")
    return log


@router.put("/logs/{log_id}", response_model=schemas.CleaningLogResponse)
def update_cleaning_log(
    log_id: int, log: schemas.CleaningLogUpdate, db: Session = Depends(get_db)
):
    """Update cleaning log"""
    db_log = db.query(models.CleaningLog).filter(models.CleaningLog.id == log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Cleaning log not found")

    for field, value in log.dict(exclude_unset=True).items():
        setattr(db_log, field, value)

    db.commit()
    db.refresh(db_log)
    return db_log


@router.get("/history/{cleaner_id}", response_model=List[schemas.CleaningLogResponse])
def get_cleaner_history(cleaner_id: int, db: Session = Depends(get_db)):
    """Get cleaning history for a cleaner"""
    logs = db.query(models.CleaningLog).filter(models.CleaningLog.cleaner_id == cleaner_id).all()
    return logs
