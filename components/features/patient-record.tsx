"use client"

import { useState } from "react"

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  age: number
  gender: string
  medicalHistory: string
  registeredDate: string
}

export function PatientRecord({
  patient,
  onBack,
  onDelete,
  editable,
}: { patient: Patient; onBack: () => void; onDelete: (id: string) => void; editable?: boolean }) {
  const [isEditing, setIsEditing] = useState(false)
  const [data, setData] = useState(patient)

  const handleSave = () => {
    const patients = JSON.parse(localStorage.getItem("hospital_patients") || "[]")
    const updated = patients.map((p: Patient) => (p.id === data.id ? data : p))
    localStorage.setItem("hospital_patients", JSON.stringify(updated))
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-primary hover:text-primary/80 text-sm font-medium">
        ← Back to Patients
      </button>

      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">{data.name}</h2>
            <p className="text-muted-foreground text-sm">ID: {data.id}</p>
          </div>
          <div className="flex gap-2">
            {editable && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm"
              >
                Edit
              </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setData(patient)
                    setIsEditing(false)
                  }}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition text-sm"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={() => {
                onDelete(patient.id)
                onBack()
              }}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition text-sm"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
              />
            ) : (
              <p className="text-foreground">{data.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
              />
            ) : (
              <p className="text-foreground">{data.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
              />
            ) : (
              <p className="text-foreground">{data.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Age</label>
            {isEditing ? (
              <input
                type="number"
                value={data.age}
                onChange={(e) => setData({ ...data, age: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
              />
            ) : (
              <p className="text-foreground">{data.age}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Gender</label>
            {isEditing ? (
              <select
                value={data.gender}
                onChange={(e) => setData({ ...data, gender: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-foreground">{data.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Registered</label>
            <p className="text-foreground">{new Date(data.registeredDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-card-foreground mb-1">Medical History</label>
          {isEditing ? (
            <textarea
              value={data.medicalHistory}
              onChange={(e) => setData({ ...data, medicalHistory: e.target.value })}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground h-32 resize-none"
              placeholder="Enter medical history..."
            />
          ) : (
            <p className="text-foreground whitespace-pre-wrap">
              {data.medicalHistory || "No medical history recorded"}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
