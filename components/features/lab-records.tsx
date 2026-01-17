"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface LabRecord {
  id: string
  patientId: string
  patientName: string
  testType: string
  result: string
  status: "pending" | "completed"
  dateCreated: string
}

export function LabRecords() {
  const [records, setRecords] = useState<LabRecord[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    patientId: "",
    testType: "",
    result: "",
  })

  useEffect(() => {
    const patientData = localStorage.getItem("hospital_patients")
    if (patientData) setPatients(JSON.parse(patientData))

    const labData = localStorage.getItem("hospital_lab_records")
    if (labData) setRecords(JSON.parse(labData))
  }, [])

  const addRecord = (e: React.FormEvent) => {
    e.preventDefault()
    const patient = patients.find((p) => p.id === formData.patientId)
    if (!patient) return

    const newRecord: LabRecord = {
      id: Date.now().toString(),
      patientId: formData.patientId,
      patientName: patient.name,
      testType: formData.testType,
      result: formData.result,
      status: "completed",
      dateCreated: new Date().toISOString(),
    }

    const updated = [...records, newRecord]
    setRecords(updated)
    localStorage.setItem("hospital_lab_records", JSON.stringify(updated))
    setFormData({ patientId: "", testType: "", result: "" })
    setShowForm(false)
  }

  const updateRecord = (id: string, status: "pending" | "completed") => {
    const updated = records.map((r) => (r.id === id ? { ...r, status } : r))
    setRecords(updated)
    localStorage.setItem("hospital_lab_records", JSON.stringify(updated))
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-card-foreground">Lab Records</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm"
        >
          {showForm ? "Cancel" : "New Record"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addRecord} className="mb-6 p-4 bg-muted rounded-lg space-y-4">
          <select
            required
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            required
            value={formData.testType}
            onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
          >
            <option value="">Select Test Type</option>
            <option value="blood">Blood Test</option>
            <option value="urinalysis">Urinalysis</option>
            <option value="xray">X-Ray</option>
            <option value="ultrasound">Ultrasound</option>
            <option value="ecg">ECG</option>
          </select>

          <textarea
            required
            placeholder="Test Result"
            value={formData.result}
            onChange={(e) => setFormData({ ...formData, result: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border rounded text-foreground h-24 resize-none"
          />

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-medium py-2 rounded hover:bg-primary/90 transition"
          >
            Save Record
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-4 py-3 text-left font-semibold text-card-foreground">Patient</th>
              <th className="px-4 py-3 text-left font-semibold text-card-foreground">Test Type</th>
              <th className="px-4 py-3 text-left font-semibold text-card-foreground">Result</th>
              <th className="px-4 py-3 text-left font-semibold text-card-foreground">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-card-foreground">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-card-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No lab records
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-4 font-medium text-card-foreground">{record.patientName}</td>
                  <td className="px-4 py-4 capitalize text-card-foreground">{record.testType}</td>
                  <td className="px-4 py-4 text-muted-foreground text-xs max-w-xs truncate">{record.result}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${record.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground text-xs">
                    {new Date(record.dateCreated).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    {record.status === "pending" && (
                      <button
                        onClick={() => updateRecord(record.id, "completed")}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
