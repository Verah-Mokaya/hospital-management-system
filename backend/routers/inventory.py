from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import get_db

router = APIRouter()


@router.post("/", response_model=schemas.InventoryResponse)
def add_item(item: schemas.InventoryCreate, db: Session = Depends(get_db)):
    """Add item to inventory"""
    db_item = models.Inventory(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@router.get("/", response_model=List[schemas.InventoryResponse])
def get_all_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all inventory items"""
    items = db.query(models.Inventory).offset(skip).limit(limit).all()
    return items


@router.get("/{item_id}", response_model=schemas.InventoryResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
    """Get inventory item by ID"""
    item = db.query(models.Inventory).filter(models.Inventory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.put("/{item_id}", response_model=schemas.InventoryResponse)
def update_item(
    item_id: int, item: schemas.InventoryUpdate, db: Session = Depends(get_db)
):
    """Update inventory item"""
    db_item = db.query(models.Inventory).filter(models.Inventory.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    for field, value in item.dict(exclude_unset=True).items():
        setattr(db_item, field, value)

    db.commit()
    db.refresh(db_item)
    return db_item


@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    """Delete inventory item"""
    item = db.query(models.Inventory).filter(models.Inventory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()
    return {"message": "Item deleted successfully"}


@router.get("/low-stock/alert")
def get_low_stock_items(db: Session = Depends(get_db)):
    """Get items below reorder level"""
    items = db.query(models.Inventory).filter(models.Inventory.quantity < models.Inventory.reorder_level).all()
    return items
