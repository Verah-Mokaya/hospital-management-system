"use client"

import { useState, useEffect } from "react"
import { PatientRecord } from "@/components/features/patient-record"

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

export function PatientList({ limit, editable }: { limit?: number; editable?: boolean }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("hospital_patients")
    if (stored) {
      let data = JSON.parse(stored)
      if (limit) data = data.slice(0, limit)
      setPatients(data)
    }
  }, [limit])

  const deletePatient = (id: string) => {
    const updated = patients.filter((p) => p.id !== id)
    setPatients(updated)
    localStorage.setItem("hospital_patients", JSON.stringify(updated))
  }

  return (
    <div className="space-y-4">
      {selectedPatient ? (
        <PatientRecord
          patient={selectedPatient}
          onBack={() => setSelectedPatient(null)}
          onDelete={deletePatient}
          editable={editable}
        />
      ) : (
        <>
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-6 py-3 text-left font-semibold text-card-foreground">Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-card-foreground">Age</th>
                    <th className="px-6 py-3 text-left font-semibold text-card-foreground">Gender</th>
                    <th className="px-6 py-3 text-left font-semibold text-card-foreground">Contact</th>
                    <th className="px-6 py-3 text-left font-semibold text-card-foreground">Registered</th>
                    <th className="px-6 py-3 text-left font-semibold text-card-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        No patients registered yet
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient) => (
                      <tr key={patient.id} className="border-b border-border hover:bg-muted/50">
                        <td className="px-6 py-4 font-medium text-card-foreground">{patient.name}</td>
                        <td className="px-6 py-4 text-card-foreground">{patient.age}</td>
                        <td className="px-6 py-4 text-card-foreground">{patient.gender}</td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">{patient.phone}</td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">
                          {new Date(patient.registeredDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => setSelectedPatient(patient)}
                            className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deletePatient(patient.id)}
                            className="px-3 py-1 bg-destructive text-destructive-foreground text-xs rounded hover:bg-destructive/90 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
