"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { EmployeeClockIn } from "./employee-clock-in"
import { generateUniversalPassword, hashPassword, getPasswordExpiryDate } from "@/lib/password-utils"

interface Employee {
  id: string
  name: string
  email: string
  role: string
  phone: string
  salary: number
  status: "active" | "inactive"
  passwordHash: string
  firstLogin: boolean
  passwordChangedAt: number
  passwordExpiresAt: number
  createdAt: number
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [showForm, setShowForm] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "nurse",
    phone: "",
    salary: "",
  })

  useEffect(() => {
    const stored = localStorage.getItem("hospital_employees")
    if (stored) setEmployees(JSON.parse(stored))
  }, [])

  const addEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    const universalPassword = generateUniversalPassword()
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      salary: Number.parseFloat(formData.salary),
      status: "active",
      passwordHash: hashPassword(universalPassword),
      firstLogin: true,
      passwordChangedAt: Date.now(),
      passwordExpiresAt: getPasswordExpiryDate(),
      createdAt: Date.now(),
    }
    const updated = [...employees, newEmployee]
    setEmployees(updated)
    localStorage.setItem("hospital_employees", JSON.stringify(updated))

    // Store employee credentials for login
    const allEmployees = JSON.parse(localStorage.getItem("hospital_all_employees") || "[]")
    allEmployees.push({
      id: newEmployee.id,
      email: newEmployee.email,
      passwordHash: newEmployee.passwordHash,
      name: newEmployee.name,
      role: newEmployee.role,
      firstLogin: true,
      passwordExpiresAt: newEmployee.passwordExpiresAt,
    })
    localStorage.setItem("hospital_all_employees", JSON.stringify(allEmployees))

    setFormData({ name: "", email: "", role: "nurse", phone: "", salary: "" })
    setShowForm(false)

    // Show credentials notification
    alert(`Employee account created!\n\nEmail: ${newEmployee.email}\nPassword: ${universalPassword}\n\nEmployee must change password on first login.`)
  }

  const deleteEmployee = (id: string) => {
    const updated = employees.filter((e) => e.id !== id)
    setEmployees(updated)
    localStorage.setItem("hospital_employees", JSON.stringify(updated))

    // Remove from all employees list
    const allEmployees = JSON.parse(localStorage.getItem("hospital_all_employees") || "[]")
    const filteredAll = allEmployees.filter((e: any) => e.id !== id)
    localStorage.setItem("hospital_all_employees", JSON.stringify(filteredAll))
  }

  const resetPassword = (employee: Employee) => {
    const universalPassword = generateUniversalPassword()
    const updated = employees.map((e) =>
      e.id === employee.id
        ? {
            ...e,
            passwordHash: hashPassword(universalPassword),
            firstLogin: true,
            passwordExpiresAt: getPasswordExpiryDate(),
          }
        : e,
    )
    setEmployees(updated)
    localStorage.setItem("hospital_employees", JSON.stringify(updated))

    // Update all employees list
    const allEmployees = JSON.parse(localStorage.getItem("hospital_all_employees") || "[]")
    const updatedAll = allEmployees.map((e: any) =>
      e.id === employee.id
        ? {
            ...e,
            passwordHash: hashPassword(universalPassword),
            firstLogin: true,
            passwordExpiresAt: getPasswordExpiryDate(),
          }
        : e,
    )
    localStorage.setItem("hospital_all_employees", JSON.stringify(updatedAll))

    alert(`Password reset for ${employee.name}\n\nPassword: ${universalPassword}`)
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-card-foreground">Employee Accounts</h3>
            <p className="text-sm text-muted-foreground mt-1">Only Admin can create employee accounts</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm"
          >
            {showForm ? "Cancel" : "Create Account"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={addEmployee} className="mb-6 p-4 bg-muted rounded-lg space-y-4 border border-border">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="john@hospital.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
              >
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="attendant">Patient Attendant</option>
                <option value="receptionist">Receptionist</option>
                <option value="technician">Technician</option>
                <option value="cleaner">Cleaner</option>
                <option value="finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Phone</label>
              <input
                type="tel"
                placeholder="+254712345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Monthly Salary (KES)</label>
              <input
                type="number"
                required
                placeholder="50000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
              />
            </div>
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> A universal password will be generated. Employee must change it on first login.
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-success text-success-foreground font-medium py-2 rounded hover:bg-success/90 transition"
            >
              Create Employee Account
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-card-foreground">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-card-foreground">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-card-foreground">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-card-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-card-foreground">First Login</th>
                <th className="px-4 py-3 text-left font-semibold text-card-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No employee accounts created yet
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-4 font-medium text-card-foreground">{emp.name}</td>
                    <td className="px-4 py-4 text-muted-foreground text-xs">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(emp.email)
                          setCopiedEmail(emp.email)
                          setTimeout(() => setCopiedEmail(null), 2000)
                        }}
                        className="hover:text-primary transition"
                        title="Click to copy"
                      >
                        {emp.email}
                        {copiedEmail === emp.email && " ✓"}
                      </button>
                    </td>
                    <td className="px-4 py-4 capitalize text-card-foreground text-xs">{emp.role}</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-success/20 text-success font-semibold text-xs rounded capitalize">
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded font-medium ${
                          emp.firstLogin ? "bg-error/20 text-error" : "bg-success/20 text-success"
                        }`}
                      >
                        {emp.firstLogin ? "Pending" : "Done"}
                      </span>
                    </td>
                    <td className="px-4 py-4 flex gap-2">
                      <button
                        onClick={() => resetPassword(emp)}
                        className="px-3 py-1 bg-yellow-600 text-yellow-50 text-xs rounded hover:bg-yellow-700 transition font-medium"
                        title="Reset to universal password"
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={() => deleteEmployee(emp.id)}
                        className="px-3 py-1 bg-error text-error-foreground text-xs rounded hover:bg-error/90 transition font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeeClockIn />
    </div>
  )
}
