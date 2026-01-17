"use client"

import { useState } from "react"
import { LabRecords } from "@/components/features/lab-records"
import { Tabs } from "@/components/common/tabs"
import { PharmacyManagement } from "@/components/features/pharmacy-management"

export function LabDashboard() {
  const [tab, setTab] = useState("records")

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Lab Dashboard</h2>
        <p className="text-muted-foreground">Manage lab tests and results</p>
      </div>

      <Tabs
        tabs={[
          { id: "records", label: "Lab Records" },
          { id: "pending", label: "Pending Tests" },
          /* Added pharmacy view for lab technicians to see medicines related to lab tests */
          { id: "pharmacy", label: "Pharmacy Reference" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div>
        {tab === "records" && <LabRecords />}
        {tab === "pending" && (
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-muted-foreground">No pending tests</p>
          </div>
        )}
        {tab === "pharmacy" && <PharmacyManagement role="lab" />}
      </div>
    </div>
  )
}
