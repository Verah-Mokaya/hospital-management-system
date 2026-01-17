"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface InventoryItem {
  id: string
  name: string
  category: "supplies" | "equipment" | "consumables"
  quantity: number
  minLevel: number
  price: number
  supplier: string
  lastRestocked: string
}

export function InventoryManagement() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "supplies" as const,
    quantity: "",
    minLevel: "",
    price: "",
    supplier: "",
  })

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("hospital_inventory") || "[]")
    setItems(stored)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      quantity: Number.parseInt(formData.quantity),
      minLevel: Number.parseInt(formData.minLevel),
      price: Number.parseFloat(formData.price),
      supplier: formData.supplier,
      lastRestocked: new Date().toISOString().split("T")[0],
    }

    const updated = [...items, newItem]
    setItems(updated)
    localStorage.setItem("hospital_inventory", JSON.stringify(updated))
    setFormData({ name: "", category: "supplies", quantity: "", minLevel: "", price: "", supplier: "" })
    setShowForm(false)
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    const updated = items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    setItems(updated)
    localStorage.setItem("hospital_inventory", JSON.stringify(updated))
  }

  const lowStockItems = items.filter((item) => item.quantity <= item.minLevel)
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Items</p>
          <p className="text-3xl font-bold text-foreground">{items.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">Low Stock Items</p>
          <p className="text-3xl font-bold text-error">{lowStockItems.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <p className="text-3xl font-bold text-foreground">KES {totalValue.toFixed(0)}</p>
        </div>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90 transition"
      >
        {showForm ? "Cancel" : "Add Item"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Add Inventory Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="supplies">Supplies</option>
              <option value="equipment">Equipment</option>
              <option value="consumables">Consumables</option>
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="number"
              placeholder="Minimum Level"
              value={formData.minLevel}
              onChange={(e) => setFormData({ ...formData, minLevel: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="number"
              placeholder="Unit Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="text"
              placeholder="Supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Add Item
          </button>
        </form>
      )}

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Inventory Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-card-foreground">Item</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground">Quantity</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground">Min Level</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground">Value</th>
                <th className="text-left py-3 px-4 font-semibold text-card-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4 text-foreground font-medium">{item.name}</td>
                  <td className="py-3 px-4 text-foreground text-xs capitalize">{item.category}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                      className="w-20 px-2 py-1 bg-input border border-border rounded text-foreground text-sm"
                    />
                  </td>
                  <td className="py-3 px-4 text-foreground">{item.minLevel}</td>
                  <td className="py-3 px-4 text-foreground">KES {(item.quantity * item.price).toFixed(0)}</td>
                  <td className="py-3 px-4">
                    {item.quantity <= item.minLevel && (
                      <span className="text-xs px-2 py-1 bg-error text-white rounded">Reorder</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
