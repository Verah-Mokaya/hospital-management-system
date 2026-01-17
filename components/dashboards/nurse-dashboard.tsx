"use client"

import { useState } from "react"
import { PatientList } from "@/components/features/patient-list"
import { Tabs } from "@/components/common/tabs"
import { StatsGrid } from "@/components/common/stats-grid"

export function NurseDashboard() {
  const [tab, setTab] = useState("patients")

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Nurse Dashboard</h2>
        <p className="text-muted-foreground">Patient care and vital records</p>
      </div>

      <StatsGrid hideEmployeeStats />

      <Tabs
        tabs={[
          { id: "patients", label: "Patients" },
          { id: "vitals", label: "Vitals Log" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div>
        {tab === "patients" && <PatientList editable={true} />}
        {tab === "vitals" && (
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-muted-foreground">Vital signs tracking coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
