"use client"

import { useEffect, useState } from "react"

export function StatsGrid({
  hideEmployeeStats,
  hidePatientStats,
}: { hideEmployeeStats?: boolean; hidePatientStats?: boolean }) {
  const [stats, setStats] = useState({
    patients: 0,
    employees: 0,
    pendingPayments: 0,
    labRecords: 0,
  })

  useEffect(() => {
    const patients = JSON.parse(localStorage.getItem("hospital_patients") || "[]")
    const employees = JSON.parse(localStorage.getItem("hospital_employees") || "[]")
    const payments = JSON.parse(localStorage.getItem("hospital_payment_requests") || "[]")
    const labRecords = JSON.parse(localStorage.getItem("hospital_lab_records") || "[]")

    setStats({
      patients: patients.length,
      employees: employees.length,
      pendingPayments: payments.filter((p: any) => p.status === "pending").length,
      labRecords: labRecords.length,
    })
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {!hidePatientStats && (
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-muted-foreground text-sm mb-1">Total Patients</p>
          <p className="text-3xl font-bold text-primary">{stats.patients}</p>
        </div>
      )}
      {!hideEmployeeStats && (
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-muted-foreground text-sm mb-1">Employees</p>
          <p className="text-3xl font-bold text-secondary">{stats.employees}</p>
        </div>
      )}
      {!hideEmployeeStats && (
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-muted-foreground text-sm mb-1">Pending Payments</p>
          <p className="text-3xl font-bold text-accent">{stats.pendingPayments}</p>
        </div>
      )}
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground text-sm mb-1">Lab Records</p>
        <p className="text-3xl font-bold text-primary">{stats.labRecords}</p>
      </div>
    </div>
  )
}
