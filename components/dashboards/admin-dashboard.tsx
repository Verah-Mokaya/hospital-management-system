"use client"

import { useState } from "react"
import { PatientList } from "@/components/features/patient-list"
import { EmployeeManagement } from "@/components/features/employee-management"
import { StatsGrid } from "@/components/common/stats-grid"
import { Tabs } from "@/components/common/tabs"
import { PharmacyManagement } from "@/components/features/pharmacy-management"
import { InventoryManagement } from "@/components/features/inventory-management"
import { AppointmentManagement } from "@/components/features/appointment-management"
import { PatientReminders } from "@/components/features/patient-reminders"

export function AdminDashboard() {
  const [tab, setTab] = useState("overview")

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage all hospital operations</p>
      </div>

      <StatsGrid />

      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "patients", label: "Patients" },
          { id: "employees", label: "Employees" },
          { id: "appointments", label: "Appointments" },
          { id: "pharmacy", label: "Pharmacy" },
          { id: "inventory", label: "Inventory" },
          { id: "reminders", label: "Reminders" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="min-h-96">
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-card-foreground mb-4">Recent Patients</h3>
              <PatientList limit={5} />
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-card-foreground mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Healthy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Server</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Backups</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Updated</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === "patients" && <PatientList />}
        {tab === "employees" && <EmployeeManagement />}
        {tab === "appointments" && <AppointmentManagement role="admin" />}
        {tab === "pharmacy" && <PharmacyManagement role="admin" />}
        {tab === "inventory" && <InventoryManagement />}
        {tab === "reminders" && <PatientReminders />}
      </div>
    </div>
  )
}
