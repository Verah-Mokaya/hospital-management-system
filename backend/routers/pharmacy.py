from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import get_db

router = APIRouter()


@router.post("/", response_model=schemas.PharmacyResponse)
def add_medicine(medicine: schemas.PharmacyCreate, db: Session = Depends(get_db)):
    """Add medicine to pharmacy"""
    db_medicine = models.Pharmacy(**medicine.dict())
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine


@router.get("/", response_model=List[schemas.PharmacyResponse])
def get_all_medicines(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all medicines"""
    medicines = db.query(models.Pharmacy).offset(skip).limit(limit).all()
    return medicines


@router.get("/{medicine_id}", response_model=schemas.PharmacyResponse)
def get_medicine(medicine_id: int, db: Session = Depends(get_db)):
    """Get medicine by ID"""
    medicine = db.query(models.Pharmacy).filter(models.Pharmacy.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return medicine


@router.put("/{medicine_id}", response_model=schemas.PharmacyResponse)
def update_medicine(
    medicine_id: int, medicine: schemas.PharmacyUpdate, db: Session = Depends(get_db)
):
    """Update medicine"""
    db_medicine = db.query(models.Pharmacy).filter(models.Pharmacy.id == medicine_id).first()
    if not db_medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    for field, value in medicine.dict(exclude_unset=True).items():
        setattr(db_medicine, field, value)

    db.commit()
    db.refresh(db_medicine)
    return db_medicine


@router.delete("/{medicine_id}")
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    """Delete medicine"""
    medicine = db.query(models.Pharmacy).filter(models.Pharmacy.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    db.delete(medicine)
    db.commit()
    return {"message": "Medicine deleted successfully"}


@router.get("/low-stock/alert")
def get_low_stock_medicines(db: Session = Depends(get_db)):
    """Get medicines with low stock"""
    medicines = db.query(models.Pharmacy).filter(models.Pharmacy.quantity < 10).all()
    return medicines
