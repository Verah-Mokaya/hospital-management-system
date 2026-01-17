"use client"

import { useState } from "react"
import { PaymentRequests } from "@/components/features/payment-requests"
import { Tabs } from "@/components/common/tabs"
import { StatsGrid } from "@/components/common/stats-grid"
import { PharmacyManagement } from "@/components/features/pharmacy-management"

export function FinanceDashboard() {
  const [tab, setTab] = useState("requests")

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Finance Dashboard</h2>
        <p className="text-muted-foreground">Manage employee payments and billing</p>
      </div>

      <StatsGrid hidePatientStats />

      <Tabs
        tabs={[
          { id: "requests", label: "Payment Requests" },
          { id: "history", label: "Payment History" },
          /* Added pharmacy billing view for finance */
          { id: "pharmacy", label: "Pharmacy Billing" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div>
        {tab === "requests" && <PaymentRequests />}
        {tab === "history" && (
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-muted-foreground">Payment history coming soon</p>
          </div>
        )}
        {tab === "pharmacy" && <PharmacyManagement role="finance" />}
      </div>
    </div>
  )
}
