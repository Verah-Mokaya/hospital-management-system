"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface PaymentRequest {
  id: string
  employeeId: string
  employeeName: string
  amount: number
  reason: string
  status: "pending" | "approved" | "rejected" | "paid"
  requestDate: string
  email: string
  phone: string
  bankDetails: string
  workedHours?: number
  overtimeHours?: number
  overtimePay?: number
  payCalculationType?: "basic" | "with_overtime"
}

function calculateOvertimePay(monthlySalary: number, overtimeHours: number): number {
  const hourlyRate = monthlySalary / 160 // Assume 160 hours per month (8 hours × 20 days)
  const overtimeRate = hourlyRate * 1.5 // Overtime is 1.5x the regular rate
  return Math.round(overtimeRate * overtimeHours * 100) / 100
}

function getEmployeeWorkedHours(employeeId: string): { workedHours: number; overtimeHours: number } {
  const clockRecords = localStorage.getItem("hospital_clock_records")
  if (!clockRecords) return { workedHours: 0, overtimeHours: 0 }

  const records = JSON.parse(clockRecords)
  const employeeRecords = records.filter((r: any) => r.employeeId === employeeId)

  const totals = employeeRecords.reduce(
    (acc: any, record: any) => ({
      workedHours: acc.workedHours + (record.workedHours || 0),
      overtimeHours: acc.overtimeHours + (record.overtimeHours || 0),
    }),
    { workedHours: 0, overtimeHours: 0 },
  )

  return {
    workedHours: Math.round(totals.workedHours * 100) / 100,
    overtimeHours: Math.round(totals.overtimeHours * 100) / 100,
  }
}

export function PaymentRequests() {
  const [requests, setRequests] = useState<PaymentRequest[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    amount: "",
    reason: "",
    bankDetails: "",
    payCalculationType: "basic" as "basic" | "with_overtime",
  })

  useEffect(() => {
    const stored = localStorage.getItem("hospital_employees")
    if (stored) setEmployees(JSON.parse(stored))

    const paymentRequests = localStorage.getItem("hospital_payment_requests")
    if (paymentRequests) setRequests(JSON.parse(paymentRequests))
  }, [])

  const submitRequest = (e: React.FormEvent) => {
    e.preventDefault()
    const emp = employees.find((e) => e.id === formData.employeeId)
    if (!emp) return

    const { workedHours, overtimeHours } = getEmployeeWorkedHours(formData.employeeId)
    const overtimePay = calculateOvertimePay(emp.salary, overtimeHours)
    const totalAmount =
      formData.payCalculationType === "with_overtime"
        ? Number.parseFloat(formData.amount) + overtimePay
        : Number.parseFloat(formData.amount)

    const newRequest: PaymentRequest = {
      id: Date.now().toString(),
      employeeId: formData.employeeId,
      employeeName: emp.name,
      amount: totalAmount,
      reason: formData.reason,
      status: "pending",
      requestDate: new Date().toISOString(),
      email: emp.email,
      phone: emp.phone,
      bankDetails: formData.bankDetails,
      workedHours,
      overtimeHours,
      overtimePay,
      payCalculationType: formData.payCalculationType,
    }

    const updated = [...requests, newRequest]
    setRequests(updated)
    localStorage.setItem("hospital_payment_requests", JSON.stringify(updated))
    setFormData({ employeeId: "", amount: "", reason: "", bankDetails: "", payCalculationType: "basic" })
    setShowForm(false)
  }

  const updateStatus = (id: string, newStatus: PaymentRequest["status"]) => {
    const updated = requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    setRequests(updated)
    localStorage.setItem("hospital_payment_requests", JSON.stringify(updated))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-card-foreground">Payment Requests</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm"
        >
          {showForm ? "Cancel" : "New Request"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitRequest} className="mb-6 p-4 bg-muted rounded-lg space-y-4">
          <select
            required
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.role})
              </option>
            ))}
          </select>

          <input
            type="number"
            required
            placeholder="Amount (KES)"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
          />

          <select
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
          >
            <option value="">Select Reason</option>
            <option value="salary">Monthly Salary</option>
            <option value="bonus">Bonus</option>
            <option value="allowance">Allowance</option>
            <option value="reimbursement">Reimbursement</option>
          </select>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Include Overtime Pay?</label>
            <select
              value={formData.payCalculationType}
              onChange={(e) => setFormData({ ...formData, payCalculationType: e.target.value as any })}
              className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
            >
              <option value="basic">Basic Payment Only</option>
              <option value="with_overtime">Include Overtime Pay (1.5x rate)</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Bank Details / M-Pesa"
            value={formData.bankDetails}
            onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border rounded text-foreground"
          />

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-medium py-2 rounded hover:bg-primary/90 transition"
          >
            Submit Request
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-4 py-3 text-left font-semibold text-card-foreground">Employee</th>
              <th className="px-4 py-3 text-left font-semibold text-card-foreground">Amount</th>
              <th className="px-4 py-3 text-left font-semibold text-card-foreground">Overtime Details</th>
              <th className="px-4 py-3 text-left font-semibold text-card-foreground">Reason</th>
              <th className="px-4 py-3 text-left font-semibold text-card-foreground">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-card-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No payment requests
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-4 font-medium text-card-foreground">{req.employeeName}</td>
                  <td className="px-4 py-4 text-card-foreground font-semibold">KES {req.amount.toLocaleString()}</td>
                  <td className="px-4 py-4 text-xs text-muted-foreground">
                    {req.workedHours !== undefined ? (
                      <div className="space-y-1">
                        <div>Worked: {req.workedHours.toFixed(2)} hrs</div>
                        {req.overtimeHours && req.overtimeHours > 0 && (
                          <div className="text-error font-semibold">
                            OT: {req.overtimeHours.toFixed(2)} hrs (KES {req.overtimePay?.toLocaleString()})
                          </div>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-4 capitalize text-muted-foreground text-xs">{req.reason}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs rounded capitalize ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex gap-2">
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(req.id, "approved")}
                          className="px-2 py-1 bg-success text-success-foreground text-xs rounded hover:bg-success/90 transition font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(req.id, "rejected")}
                          className="px-2 py-1 bg-error text-error-foreground text-xs rounded hover:bg-error/90 transition font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {req.status === "approved" && (
                      <button
                        onClick={() => updateStatus(req.id, "paid")}
                        className="px-2 py-1 bg-success text-success-foreground text-xs rounded hover:bg-success/90 transition font-medium"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
