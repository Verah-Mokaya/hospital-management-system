from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import models
import schemas
from database import get_db
from utils import calculate_worked_hours

router = APIRouter()


@router.post("/clock-in")
def clock_in(request: schemas.ClockInRequest, db: Session = Depends(get_db)):
    """Employee clock in"""
    employee = db.query(models.Employee).filter(models.Employee.id == request.employee_id).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check if already clocked in
    today_record = (
        db.query(models.ClockRecord)
        .filter(
            models.ClockRecord.employee_id == request.employee_id,
            models.ClockRecord.clock_in_time.like(datetime.utcnow().strftime("%Y-%m-%d%")),
            models.ClockRecord.clock_out_time.is_(None),
        )
        .first()
    )

    if today_record:
        raise HTTPException(status_code=400, detail="Already clocked in")

    # Create clock record
    clock_record = models.ClockRecord(
        employee_id=request.employee_id,
        clock_in_time=datetime.utcnow(),
    )

    db.add(clock_record)
    db.commit()
    db.refresh(clock_record)

    return {"message": "Clocked in successfully", "record": schemas.ClockRecordResponse.from_orm(clock_record)}


@router.post("/clock-out")
def clock_out(request: schemas.ClockOutRequest, db: Session = Depends(get_db)):
    """Employee clock out"""
    employee = db.query(models.Employee).filter(models.Employee.id == request.employee_id).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Get today's clock in record
    today_record = (
        db.query(models.ClockRecord)
        .filter(
            models.ClockRecord.employee_id == request.employee_id,
            models.ClockRecord.clock_in_time.like(datetime.utcnow().strftime("%Y-%m-%d%")),
            models.ClockRecord.clock_out_time.is_(None),
        )
        .first()
    )

    if not today_record:
        raise HTTPException(status_code=400, detail="No active clock in record")

    # Calculate hours
    today_record.clock_out_time = datetime.utcnow()
    worked_hours, overtime_hours = calculate_worked_hours(
        today_record.clock_in_time, today_record.clock_out_time
    )

    today_record.worked_hours = worked_hours
    today_record.overtime_hours = overtime_hours

    db.commit()
    db.refresh(today_record)

    return {
        "message": "Clocked out successfully",
        "record": schemas.ClockRecordResponse.from_orm(today_record),
    }


@router.get("/clock-records/{employee_id}", response_model=List[schemas.ClockRecordResponse])
def get_clock_records(employee_id: int, db: Session = Depends(get_db)):
    """Get employee clock records"""
    records = (
        db.query(models.ClockRecord)
        .filter(models.ClockRecord.employee_id == employee_id)
        .all()
    )
    return records


@router.get("/", response_model=List[schemas.EmployeeResponse])
def get_all_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all employees"""
    employees = db.query(models.Employee).offset(skip).limit(limit).all()
    return employees


@router.get("/{employee_id}", response_model=schemas.EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    """Get employee by ID"""
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee
