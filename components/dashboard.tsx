"use client"

import { useState } from "react"
import { AdminDashboard } from "./dashboards/admin-dashboard"
import { DoctorDashboard } from "./dashboards/doctor-dashboard"
import { NurseDashboard } from "./dashboards/nurse-dashboard"
import { ReceptionistDashboard } from "./dashboards/receptionist-dashboard"
import { AttendantDashboard } from "./dashboards/attendant-dashboard"
import { FinanceDashboard } from "./dashboards/finance-dashboard"
import { LabDashboard } from "./dashboards/lab-dashboard"
import { CleanerDashboard } from "./dashboards/cleaner-dashboard"

export function Dashboard({ user, setUser }: { user: any; setUser: (user: any) => void }) {
  const [currentTab, setCurrentTab] = useState(user.role)

  const handleLogout = () => {
    localStorage.removeItem("hospital_user")
    setUser(null)
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard />
      case "doctor":
        return <DoctorDashboard />
      case "nurse":
        return <NurseDashboard />
      case "receptionist":
        return <ReceptionistDashboard />
      case "attendant":
        return <AttendantDashboard />
      case "finance":
        return <FinanceDashboard />
      case "lab":
        return <LabDashboard />
      case "cleaner":
        return <CleanerDashboard />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">H</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-card-foreground">Hospital MS</h1>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="font-medium text-card-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderDashboard()}</main>
    </div>
  )
}
