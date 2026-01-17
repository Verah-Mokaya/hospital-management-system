"use client"

import { useState, useEffect } from "react"

interface ClockRecord {
  id: string
  employeeId: string
  employeeName: string
  clockInTime: string
  clockOutTime: string | null
  date: string
  workedHours: number
  overtimeHours: number
}

function calculateHours(startTime: string, endTime: string): number {
  const start = new Date(startTime)
  const end = new Date(endTime)
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60)
}

export function EmployeeClockIn() {
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [records, setRecords] = useState<ClockRecord[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("hospital_employees")
    if (stored) setEmployees(JSON.parse(stored))

    const clockRecords = localStorage.getItem("hospital_clock_records")
    if (clockRecords) setRecords(JSON.parse(clockRecords))
  }, [])

  const handleClockIn = () => {
    if (!selectedEmployee) return

    const emp = employees.find((e) => e.id === selectedEmployee)
    const newRecord: ClockRecord = {
      id: Date.now().toString(),
      employeeId: selectedEmployee,
      employeeName: emp.name,
      clockInTime: new Date().toISOString(),
      clockOutTime: null,
      date: new Date().toLocaleDateString(),
      workedHours: 0,
      overtimeHours: 0,
    }

    const updated = [...records, newRecord]
    setRecords(updated)
    localStorage.setItem("hospital_clock_records", JSON.stringify(updated))
    setSelectedEmployee("")
  }

  const handleClockOut = (recordId: string) => {
    const updated = records.map((r) => {
      if (r.id === recordId) {
        const clockOutTime = new Date().toISOString()
        const workedHours = calculateHours(r.clockInTime, clockOutTime)
        const overtimeHours = Math.max(0, workedHours - 8)
        return {
          ...r,
          clockOutTime,
          workedHours: Math.round(workedHours * 100) / 100,
          overtimeHours: Math.round(overtimeHours * 100) / 100,
        }
      }
      return r
    })
    setRecords(updated)
    localStorage.setItem("hospital_clock_records", JSON.stringify(updated))
  }

  const todayRecords = records.filter((r) => r.date === new Date().toLocaleDateString())

  const formatHours = (hours: number) => {
    return hours === 0 ? "-" : `${hours.toFixed(2)} hrs`
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-xl font-semibold text-card-foreground mb-6">Clock In/Out</h3>

      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">Select Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Choose employee...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleClockIn}
          disabled={!selectedEmployee}
          className="w-full bg-success text-success-foreground font-medium py-2 rounded-lg hover:bg-success/90 transition disabled:bg-muted disabled:cursor-not-allowed"
        >
          Clock In
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-card-foreground mb-4">Today's Records</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-card-foreground">Employee</th>
                <th className="px-4 py-3 text-left font-semibold text-card-foreground">Clock In</th>
                <th className="px-4 py-3 text-left font-semibold text-card-foreground">Clock Out</th>
                <th className="px-4 py-3 text-left font-semibold text-card-foreground">Worked Hours</th>
                <th className="px-4 py-3 text-left font-semibold text-card-foreground">Overtime Hours</th>
                <th className="px-4 py-3 text-left font-semibold text-card-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {todayRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No clock records for today
                  </td>
                </tr>
              ) : (
                todayRecords.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-4 font-medium text-card-foreground">{record.employeeName}</td>
                    <td className="px-4 py-4 text-muted-foreground text-xs">
                      {new Date(record.clockInTime).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-4">
                      {record.clockOutTime ? (
                        <span className="text-success font-semibold text-xs">
                          {new Date(record.clockOutTime).toLocaleTimeString()}
                        </span>
                      ) : (
                        <span className="text-error font-semibold text-xs">Not clocked out</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-card-foreground text-xs font-semibold">
                      {formatHours(record.workedHours)}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      {record.overtimeHours > 0 ? (
                        <span className="font-semibold text-error">{formatHours(record.overtimeHours)}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {!record.clockOutTime && (
                        <button
                          onClick={() => handleClockOut(record.id)}
                          className="px-3 py-1 bg-error text-error-foreground text-xs rounded hover:bg-error/90 transition font-medium"
                        >
                          Clock Out
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
    </div>
  )
}
