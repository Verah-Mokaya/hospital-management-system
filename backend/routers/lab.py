from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import get_db

router = APIRouter()


@router.post("/records", response_model=schemas.LabRecordResponse)
def create_lab_record(record: schemas.LabRecordCreate, db: Session = Depends(get_db)):
    """Create new lab record"""
    patient = db.query(models.Patient).filter(models.Patient.id == record.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    db_record = models.LabRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


@router.get("/records", response_model=List[schemas.LabRecordResponse])
def get_all_lab_records(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all lab records"""
    records = db.query(models.LabRecord).offset(skip).limit(limit).all()
    return records


@router.get("/records/{record_id}", response_model=schemas.LabRecordResponse)
def get_lab_record(record_id: int, db: Session = Depends(get_db)):
    """Get lab record by ID"""
    record = db.query(models.LabRecord).filter(models.LabRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Lab record not found")
    return record


@router.put("/records/{record_id}", response_model=schemas.LabRecordResponse)
def update_lab_record(
    record_id: int, record: schemas.LabRecordUpdate, db: Session = Depends(get_db)
):
    """Update lab record"""
    db_record = db.query(models.LabRecord).filter(models.LabRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Lab record not found")

    for field, value in record.dict(exclude_unset=True).items():
        setattr(db_record, field, value)

    db.commit()
    db.refresh(db_record)
    return db_record


@router.get("/patient/{patient_id}", response_model=List[schemas.LabRecordResponse])
def get_patient_lab_records(patient_id: int, db: Session = Depends(get_db)):
    """Get all lab records for a patient"""
    records = db.query(models.LabRecord).filter(models.LabRecord.patient_id == patient_id).all()
    return records
