"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface Medicine {
  id: string
  name: string
  dosage: string
  quantity: number
  price: number
  expiryDate: string
  supplier: string
}

interface Prescription {
  id: string
  patientId: string
  patientName: string
  doctorName: string
  medicines: { medicineId: string; medicineName: string; dosage: string; quantity: number }[]
  date: string
  status: "pending" | "dispensed" | "cancelled"
}

export function PharmacyManagement({ role }: { role: string }) {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [tab, setTab] = useState<"medicines" | "prescriptions">("medicines")
  const [showMedicineForm, setShowMedicineForm] = useState(false)
  const [medicineForm, setMedicineForm] = useState({
    name: "",
    dosage: "",
    quantity: "",
    price: "",
    expiryDate: "",
    supplier: "",
  })

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("hospital_medicines") || "[]")
    setMedicines(stored)

    const presData = JSON.parse(localStorage.getItem("hospital_prescriptions") || "[]")
    setPrescriptions(presData)
  }, [])

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault()
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: medicineForm.name,
      dosage: medicineForm.dosage,
      quantity: Number.parseInt(medicineForm.quantity),
      price: Number.parseFloat(medicineForm.price),
      expiryDate: medicineForm.expiryDate,
      supplier: medicineForm.supplier,
    }

    const updated = [...medicines, newMedicine]
    setMedicines(updated)
    localStorage.setItem("hospital_medicines", JSON.stringify(updated))
    setMedicineForm({ name: "", dosage: "", quantity: "", price: "", expiryDate: "", supplier: "" })
    setShowMedicineForm(false)
  }

  const updatePrescriptionStatus = (prescriptionId: string, newStatus: string) => {
    const updated = prescriptions.map((p) => (p.id === prescriptionId ? { ...p, status: newStatus as any } : p))
    setPrescriptions(updated)
    localStorage.setItem("hospital_prescriptions", JSON.stringify(updated))
  }

  const pendingPrescriptions = prescriptions.filter((p) => p.status === "pending")
  const lowStockMedicines = medicines.filter((m) => m.quantity < 10)

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setTab("medicines")}
          className={`px-4 py-2 font-medium ${
            tab === "medicines" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
        >
          Medicines ({medicines.length})
        </button>
        <button
          onClick={() => setTab("prescriptions")}
          className={`px-4 py-2 font-medium ${
            tab === "prescriptions" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
        >
          Prescriptions ({pendingPrescriptions.length})
        </button>
      </div>

      {tab === "medicines" && (
        <div className="space-y-4">
          {role === "admin" && (
            <button
              onClick={() => setShowMedicineForm(!showMedicineForm)}
              className="bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90 transition"
            >
              {showMedicineForm ? "Cancel" : "Add Medicine"}
            </button>
          )}

          {showMedicineForm && (
            <form onSubmit={handleAddMedicine} className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Add New Medicine</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Medicine Name"
                  value={medicineForm.name}
                  onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                  className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g., 500mg)"
                  value={medicineForm.dosage}
                  onChange={(e) => setMedicineForm({ ...medicineForm, dosage: e.target.value })}
                  className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={medicineForm.quantity}
                  onChange={(e) => setMedicineForm({ ...medicineForm, quantity: e.target.value })}
                  className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={medicineForm.price}
                  onChange={(e) => setMedicineForm({ ...medicineForm, price: e.target.value })}
                  className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <input
                  type="date"
                  value={medicineForm.expiryDate}
                  onChange={(e) => setMedicineForm({ ...medicineForm, expiryDate: e.target.value })}
                  className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <input
                  type="text"
                  placeholder="Supplier"
                  value={medicineForm.supplier}
                  onChange={(e) => setMedicineForm({ ...medicineForm, supplier: e.target.value })}
                  className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:bg-primary/90 transition"
              >
                Add Medicine
              </button>
            </form>
          )}

          {lowStockMedicines.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Low Stock Alert</h4>
              <p className="text-sm text-orange-700">{lowStockMedicines.length} medicines have low stock</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-card-foreground">Medicine</th>
                  <th className="text-left py-3 px-4 font-semibold text-card-foreground">Dosage</th>
                  <th className="text-left py-3 px-4 font-semibold text-card-foreground">Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-card-foreground">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-card-foreground">Expiry</th>
                  <th className="text-left py-3 px-4 font-semibold text-card-foreground">Supplier</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => (
                  <tr key={med.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-foreground font-medium">{med.name}</td>
                    <td className="py-3 px-4 text-foreground">{med.dosage}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          med.quantity < 10 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {med.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground">KES {med.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-foreground text-xs">{med.expiryDate}</td>
                    <td className="py-3 px-4 text-foreground">{med.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "prescriptions" && (
        <div className="space-y-4">
          {pendingPrescriptions.length === 0 ? (
            <p className="text-muted-foreground">No pending prescriptions</p>
          ) : (
            <div className="grid gap-4">
              {pendingPrescriptions.map((pres) => (
                <div key={pres.id} className="bg-card rounded-lg border border-border p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Patient</p>
                      <p className="font-medium text-foreground">{pres.patientName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Doctor</p>
                      <p className="font-medium text-foreground">{pres.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">{pres.date}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-card-foreground mb-2">Medicines:</p>
                    <ul className="text-sm text-foreground space-y-1">
                      {pres.medicines.map((med, idx) => (
                        <li key={idx}>
                          {med.medicineName} - {med.dosage} x{med.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => updatePrescriptionStatus(pres.id, "dispensed")}
                    className="bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90 transition"
                  >
                    Mark Dispensed
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
