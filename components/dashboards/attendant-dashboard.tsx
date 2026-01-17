"use client"

import { useState, useEffect } from "react"
import { PatientList } from "@/components/features/patient-list"
import { Tabs } from "@/components/common/tabs"

interface PatientStatus {
  id: string
  name: string
  status: "waiting" | "in-care" | "discharged"
  admissionDate: string
  room?: string
  notes?: string
}

export function AttendantDashboard() {
  const [tab, setTab] = useState("patients")
  const [statuses, setStatuses] = useState<PatientStatus[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("patient_statuses")
    if (saved) {
      setStatuses(JSON.parse(saved))
    }
  }, [])

  const handleStatusUpdate = (patientId: string, newStatus: "waiting" | "in-care" | "discharged") => {
    const updated = statuses.map((s) => (s.id === patientId ? { ...s, status: newStatus } : s))
    setStatuses(updated)
    localStorage.setItem("patient_statuses", JSON.stringify(updated))
  }

  const handleAddNote = (patientId: string, note: string) => {
    const updated = statuses.map((s) => (s.id === patientId ? { ...s, notes: note } : s))
    setStatuses(updated)
    localStorage.setItem("patient_statuses", JSON.stringify(updated))
  }

  const handleAddRoom = (patientId: string, room: string) => {
    const updated = statuses.map((s) => (s.id === patientId ? { ...s, room } : s))
    setStatuses(updated)
    localStorage.setItem("patient_statuses", JSON.stringify(updated))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-care":
        return "bg-success/20 text-success border-success/30"
      case "waiting":
        return "bg-warning/20 text-warning border-warning/30"
      case "discharged":
        return "bg-error/20 text-error border-error/30"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Patient Attendant Dashboard</h2>
        <p className="text-muted-foreground">Manage patient care and room assignments</p>
      </div>

      <Tabs
        tabs={[
          { id: "patients", label: "Patient Care" },
          { id: "status", label: "Patient Status" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "patients" && <PatientList />}

      {tab === "status" && (
        <div className="space-y-4">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Patient Status & Care</h3>

            {statuses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No patients currently tracked. Register patients first.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {statuses.map((patient) => (
                  <div key={patient.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{patient.name}</h4>
                        <p className="text-xs text-muted-foreground">Admitted: {patient.admissionDate}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}
                      >
                        {patient.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">Room Number</label>
                        <input
                          type="text"
                          value={patient.room || ""}
                          onChange={(e) => handleAddRoom(patient.id, e.target.value)}
                          placeholder="Room 101"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">Status</label>
                        <select
                          value={patient.status}
                          onChange={(e) => handleStatusUpdate(patient.id, e.target.value as any)}
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="waiting">Waiting</option>
                          <option value="in-care">In Care</option>
                          <option value="discharged">Discharged</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Care Notes</label>
                      <textarea
                        value={patient.notes || ""}
                        onChange={(e) => handleAddNote(patient.id, e.target.value)}
                        placeholder="Add care notes, medications, or observations..."
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
