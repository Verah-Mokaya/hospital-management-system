"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  reason: string
  status: "scheduled" | "completed" | "cancelled"
  notes: string
}

export function AppointmentManagement({ role }: { role: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [doctors] = useState([
    { id: "doc1", name: "Dr. James Kariuki" },
    { id: "doc2", name: "Dr. Sarah Omondi" },
    { id: "doc3", name: "Dr. Peter Mwangi" },
  ])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  })

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("hospital_appointments") || "[]")
    setAppointments(stored)

    const patientsData = JSON.parse(localStorage.getItem("hospital_patients") || "[]")
    setPatients(patientsData)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) {
      alert("Please fill all required fields")
      return
    }

    const patient = patients.find((p) => p.id === formData.patientId)
    const doctor = doctors.find((d) => d.id === formData.doctorId)

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientId: formData.patientId,
      patientName: patient?.name || "",
      doctorId: formData.doctorId,
      doctorName: doctor?.name || "",
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      status: "scheduled",
      notes: "",
    }

    const updated = [...appointments, newAppointment]
    setAppointments(updated)
    localStorage.setItem("hospital_appointments", JSON.stringify(updated))

    sendAppointmentReminder(patient, newAppointment)

    setFormData({ patientId: "", doctorId: "", date: "", time: "", reason: "" })
    setShowForm(false)
    alert("Appointment scheduled successfully!")
  }

  const sendAppointmentReminder = (patient: any, appointment: Appointment) => {
    const reminders = JSON.parse(localStorage.getItem("hospital_reminders") || "[]")
    reminders.push({
      id: Date.now().toString(),
      type: "appointment",
      patientId: patient.id,
      patientName: patient.name,
      patientEmail: patient.email,
      patientPhone: patient.phone,
      appointmentId: appointment.id,
      date: appointment.date,
      time: appointment.time,
      doctor: appointment.doctorName,
      message: `Reminder: You have an appointment with ${appointment.doctorName} on ${appointment.date} at ${appointment.time}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem("hospital_reminders", JSON.stringify(reminders))
  }

  const updateAppointmentStatus = (appointmentId: string, newStatus: string) => {
    const updated = appointments.map((apt) => (apt.id === appointmentId ? { ...apt, status: newStatus as any } : apt))
    setAppointments(updated)
    localStorage.setItem("hospital_appointments", JSON.stringify(updated))
  }

  const upcomingAppointments = appointments
    .filter((apt) => apt.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10)

  return (
    <div className="space-y-6">
      {(role === "receptionist" || role === "admin") && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90 transition"
        >
          {showForm ? "Cancel" : "Schedule Appointment"}
        </button>
      )}

      {showForm && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Schedule New Appointment</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Patient *</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Doctor *</label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Time *</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Reason for Visit</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                placeholder="Chief complaint, symptoms, etc."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:bg-primary/90 transition"
            >
              Schedule Appointment
            </button>
          </form>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Upcoming Appointments ({upcomingAppointments.length})
        </h3>
        {upcomingAppointments.length === 0 ? (
          <p className="text-muted-foreground">No upcoming appointments</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-card-foreground">Patient</th>
                  <th className="text-left py-3 px-4 font-semibold text-card-foreground">Doctor</th>
                  <th className="text-left py-3 px-4 font-semibold text-card-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-card-foreground">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-card-foreground">Reason</th>
                  {(role === "doctor" || role === "admin") && (
                    <th className="text-left py-3 px-4 font-semibold text-card-foreground">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-foreground">{apt.patientName}</td>
                    <td className="py-3 px-4 text-foreground">{apt.doctorName}</td>
                    <td className="py-3 px-4 text-foreground">{apt.date}</td>
                    <td className="py-3 px-4 text-foreground">{apt.time}</td>
                    <td className="py-3 px-4 text-foreground text-xs">{apt.reason.substring(0, 30)}...</td>
                    {(role === "doctor" || role === "admin") && (
                      <td className="py-3 px-4">
                        <select
                          value={apt.status}
                          onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                          className="text-xs px-2 py-1 bg-input border border-border rounded text-foreground"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
