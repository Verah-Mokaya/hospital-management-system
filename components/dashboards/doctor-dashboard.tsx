"use client"

import { useState } from "react"
import { PatientList } from "@/components/features/patient-list"
import { Tabs } from "@/components/common/tabs"
import { StatsGrid } from "@/components/common/stats-grid"
import { AppointmentManagement } from "@/components/features/appointment-management"

export function DoctorDashboard() {
  const [tab, setTab] = useState("patients")

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Doctor Dashboard</h2>
        <p className="text-muted-foreground">View and manage patient records</p>
      </div>

      <StatsGrid hideEmployeeStats />

      <Tabs
        tabs={[
          { id: "patients", label: "Patients" },
          { id: "appointments", label: "Appointments" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div>
        {tab === "patients" && <PatientList editable={true} />}
        {tab === "appointments" && <AppointmentManagement role="doctor" />}
      </div>
    </div>
  )
}
