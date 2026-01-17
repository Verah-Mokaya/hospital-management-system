"use client"

import { useState } from "react"
import { PatientRegistration } from "@/components/features/patient-registration"
import { PatientList } from "@/components/features/patient-list"
import { Tabs } from "@/components/common/tabs"
import { AppointmentManagement } from "@/components/features/appointment-management"
import { PatientReminders } from "@/components/features/patient-reminders"

export function ReceptionistDashboard() {
  const [tab, setTab] = useState("register")

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Receptionist Dashboard</h2>
        <p className="text-muted-foreground">Patient registration, appointments, and reminders</p>
      </div>

      <Tabs
        tabs={[
          { id: "register", label: "Register Patient" },
          { id: "patients", label: "All Patients" },
          { id: "appointments", label: "Appointments" },
          { id: "reminders", label: "Patient Reminders" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div>
        {tab === "register" && <PatientRegistration />}
        {tab === "patients" && <PatientList />}
        {tab === "appointments" && <AppointmentManagement role="receptionist" />}
        {tab === "reminders" && <PatientReminders />}
      </div>
    </div>
  )
}
