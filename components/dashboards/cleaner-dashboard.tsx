"use client"

import { useState, useEffect } from "react"
import { Tabs } from "@/components/common/tabs"

interface CleaningLog {
  id: string
  area: string
  areaType: "washroom" | "ward" | "common"
  cleanedBy: string
  cleaningTime: string
  date: string
  notes?: string
  completed: boolean
}

interface Ward {
  id: string
  name: string
  bedCount: number
  occupiedBeds: number
  lastCleaned?: string
  cleaningStatus: "pending" | "in-progress" | "completed"
}

export function CleanerDashboard() {
  const [tab, setTab] = useState("log-cleaning")
  const [logs, setLogs] = useState<CleaningLog[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedArea, setSelectedArea] = useState("")
  const [areaType, setAreaType] = useState<"washroom" | "ward" | "common">("washroom")
  const [notes, setNotes] = useState("")
  const [cleaningTime, setCleaningTime] = useState("")

  useEffect(() => {
    const savedLogs = localStorage.getItem("cleaning_logs")
    const savedWards = localStorage.getItem("hospital_wards")

    if (savedLogs) {
      setLogs(JSON.parse(savedLogs))
    }

    if (savedWards) {
      setWards(JSON.parse(savedWards))
    } else {
      // Initialize default wards
      const defaultWards: Ward[] = [
        { id: "1", name: "Ward A", bedCount: 10, occupiedBeds: 6, cleaningStatus: "completed" },
        { id: "2", name: "Ward B", bedCount: 8, occupiedBeds: 4, cleaningStatus: "pending" },
        { id: "3", name: "ICU", bedCount: 5, occupiedBeds: 3, cleaningStatus: "in-progress" },
        { id: "4", name: "Washroom 1", bedCount: 1, occupiedBeds: 0, cleaningStatus: "completed" },
        { id: "5", name: "Washroom 2", bedCount: 1, occupiedBeds: 0, cleaningStatus: "pending" },
      ]
      setWards(defaultWards)
      localStorage.setItem("hospital_wards", JSON.stringify(defaultWards))
    }
  }, [])

  const handleLogCleaning = () => {
    if (!selectedArea || !cleaningTime) {
      alert("Please fill in all fields")
      return
    }

    const newLog: CleaningLog = {
      id: Date.now().toString(),
      area: selectedArea,
      areaType,
      cleanedBy: "Maria Garcia",
      cleaningTime,
      date: new Date().toLocaleDateString(),
      notes,
      completed: true,
    }

    const updatedLogs = [...logs, newLog]
    setLogs(updatedLogs)
    localStorage.setItem("cleaning_logs", JSON.stringify(updatedLogs))

    // Update ward status
    const updatedWards = wards.map((w) =>
      w.id === selectedArea
        ? { ...w, lastCleaned: new Date().toLocaleString(), cleaningStatus: "completed" as const }
        : w,
    )
    setWards(updatedWards)
    localStorage.setItem("hospital_wards", JSON.stringify(updatedWards))

    setSelectedArea("")
    setCleaningTime("")
    setNotes("")
  }

  const handleWardBooking = (wardId: string, newStatus: "pending" | "in-progress" | "completed") => {
    const updatedWards = wards.map((w) => (w.id === wardId ? { ...w, cleaningStatus: newStatus } : w))
    setWards(updatedWards)
    localStorage.setItem("hospital_wards", JSON.stringify(updatedWards))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/20 text-success border-success/30"
      case "in-progress":
        return "bg-warning/20 text-warning border-warning/30"
      case "pending":
        return "bg-error/20 text-error border-error/30"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Cleaner Dashboard</h2>
        <p className="text-muted-foreground">Log cleaning activities and manage ward sanitization</p>
      </div>

      <Tabs
        tabs={[
          { id: "log-cleaning", label: "Log Cleaning" },
          { id: "wards", label: "Ward Cleaning Schedule" },
          { id: "history", label: "Cleaning History" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "log-cleaning" && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Log Cleaning Activity</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Area/Ward/Washroom</label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select area</option>
                {wards.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Area Type</label>
                <select
                  value={areaType}
                  onChange={(e) => setAreaType(e.target.value as any)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="washroom">Washroom</option>
                  <option value="ward">Ward</option>
                  <option value="common">Common Area</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Cleaning Duration (mins)</label>
                <input
                  type="number"
                  value={cleaningTime}
                  onChange={(e) => setCleaningTime(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Cleaning Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Any issues found, supplies used, etc."
                rows={3}
              />
            </div>

            <button
              onClick={handleLogCleaning}
              className="w-full bg-success text-success-foreground font-medium py-2 rounded-lg hover:bg-success/90 transition"
            >
              Log Cleaning Complete
            </button>
          </div>
        </div>
      )}

      {tab === "wards" && (
        <div className="space-y-4">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Ward Cleaning Schedule</h3>
            <div className="space-y-3">
              {wards.map((ward) => (
                <div key={ward.id} className="border border-border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{ward.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Beds: {ward.occupiedBeds}/{ward.bedCount} occupied
                    </p>
                    {ward.lastCleaned && (
                      <p className="text-xs text-muted-foreground">Last cleaned: {ward.lastCleaned}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ward.cleaningStatus)}`}
                    >
                      {ward.cleaningStatus.toUpperCase()}
                    </span>
                    <select
                      value={ward.cleaningStatus}
                      onChange={(e) => handleWardBooking(ward.id, e.target.value as any)}
                      className="px-3 py-1 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Cleaning History</h3>
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No cleaning logs yet.</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{log.area}</h4>
                    <span className="text-xs text-muted-foreground">{log.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="text-foreground font-medium capitalize">{log.areaType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-foreground font-medium">{log.cleaningTime} mins</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cleaned By</p>
                      <p className="text-foreground font-medium">{log.cleanedBy}</p>
                    </div>
                  </div>
                  {log.notes && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                      <p className="text-sm text-foreground">{log.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
