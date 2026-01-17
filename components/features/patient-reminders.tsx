"use client"

import { useState, useEffect } from "react"

interface Reminder {
  id: string
  type: "appointment" | "medication" | "followup"
  patientId: string
  patientName: string
  patientEmail: string
  patientPhone: string
  message: string
  date: string
  status: "pending" | "sent" | "failed"
  createdAt: string
}

export function PatientReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [tab, setTab] = useState<"pending" | "history">("pending")

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("hospital_reminders") || "[]")
    setReminders(stored)
  }, [])

  const sendReminder = (reminderId: string) => {
    const updated = reminders.map((r) => (r.id === reminderId ? { ...r, status: "sent" as const } : r))
    setReminders(updated)
    localStorage.setItem("hospital_reminders", JSON.stringify(updated))
    alert("Reminder sent via SMS/Email to " + reminders.find((r) => r.id === reminderId)?.patientPhone)
  }

  const pendingReminders = reminders.filter((r) => r.status === "pending")
  const sentReminders = reminders.filter((r) => r.status === "sent")

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setTab("pending")}
          className={`px-4 py-2 font-medium ${
            tab === "pending" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
        >
          Pending ({pendingReminders.length})
        </button>
        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 font-medium ${
            tab === "history" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
        >
          Sent ({sentReminders.length})
        </button>
      </div>

      {tab === "pending" && (
        <div className="grid gap-4">
          {pendingReminders.length === 0 ? (
            <p className="text-muted-foreground">No pending reminders</p>
          ) : (
            pendingReminders.map((reminder) => (
              <div key={reminder.id} className="bg-card rounded-lg border border-border p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Patient</p>
                        <p className="font-medium text-foreground">{reminder.patientName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium capitalize">
                          {reminder.type}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium text-foreground">{reminder.patientPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground text-sm">{reminder.patientEmail}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Message</p>
                      <p className="text-sm text-foreground bg-muted p-2 rounded">{reminder.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => sendReminder(reminder.id)}
                    className="bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90 transition whitespace-nowrap"
                  >
                    Send Reminder
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "history" && (
        <div className="grid gap-4">
          {sentReminders.length === 0 ? (
            <p className="text-muted-foreground">No sent reminders</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-card-foreground">Patient</th>
                    <th className="text-left py-3 px-4 font-semibold text-card-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-card-foreground">Message</th>
                    <th className="text-left py-3 px-4 font-semibold text-card-foreground">Contact</th>
                    <th className="text-left py-3 px-4 font-semibold text-card-foreground">Sent Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sentReminders.map((reminder) => (
                    <tr key={reminder.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-foreground font-medium">{reminder.patientName}</td>
                      <td className="py-3 px-4 text-foreground text-xs capitalize">{reminder.type}</td>
                      <td className="py-3 px-4 text-foreground text-xs max-w-xs truncate">{reminder.message}</td>
                      <td className="py-3 px-4 text-foreground text-xs">{reminder.patientPhone}</td>
                      <td className="py-3 px-4 text-foreground">{reminder.createdAt.split("T")[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
