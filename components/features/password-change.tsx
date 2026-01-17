"use client"

import type React from "react"
import { useState } from "react"
import { validatePassword, hashPassword, getPasswordExpiryDate } from "@/lib/password-utils"

interface PasswordChangeProps {
  employeeId: string
  employeeName: string
  onPasswordChanged: () => void
  isFirstLogin?: boolean
}

export function PasswordChange({ employeeId, employeeName, onPasswordChanged, isFirstLogin = false }: PasswordChangeProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: string[] = []

    // Validate current password
    if (!isFirstLogin && !currentPassword) {
      newErrors.push("Current password is required")
    }

    // Validate new password
    if (!newPassword) {
      newErrors.push("New password is required")
    } else {
      const validation = validatePassword(newPassword, employeeName)
      if (!validation.valid) {
        newErrors.push(...validation.errors)
      }
    }

    // Validate confirmation
    if (newPassword !== confirmPassword) {
      newErrors.push("Passwords do not match")
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    // Get stored employees
    const storedEmployees = localStorage.getItem("hospital_employees")
    const employees = storedEmployees ? JSON.parse(storedEmployees) : []

    // Find and update employee
    const employeeIndex = employees.findIndex((e: any) => e.id === employeeId)
    if (employeeIndex !== -1) {
      const employee = employees[employeeIndex]

      // If not first login, verify current password
      if (!isFirstLogin) {
        const employeeData = localStorage.getItem(`hospital_employee_${employeeId}`)
        const empData = employeeData ? JSON.parse(employeeData) : employee
        if (!empData.passwordHash || empData.passwordHash !== hashPassword(currentPassword)) {
          setErrors(["Current password is incorrect"])
          return
        }
      }

      // Update password
      const updatedEmployee = {
        ...employee,
        passwordHash: hashPassword(newPassword),
        firstLogin: false,
        passwordChangedAt: Date.now(),
        passwordExpiresAt: getPasswordExpiryDate(),
      }

      employees[employeeIndex] = updatedEmployee
      localStorage.setItem("hospital_employees", JSON.stringify(employees))
      localStorage.setItem(`hospital_employee_${employeeId}`, JSON.stringify(updatedEmployee))

      // Also update login credentials
      const allUsers = localStorage.getItem("hospital_all_employees") || "[]"
      const usersList = JSON.parse(allUsers)
      const userIndex = usersList.findIndex((u: any) => u.id === employeeId)
      if (userIndex !== -1) {
        usersList[userIndex] = {
          ...usersList[userIndex],
          passwordHash: hashPassword(newPassword),
          firstLogin: false,
          passwordChangedAt: Date.now(),
          passwordExpiresAt: getPasswordExpiryDate(),
        }
        localStorage.setItem("hospital_all_employees", JSON.stringify(usersList))
      }

      setSuccess(true)
      setErrors([])
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        onPasswordChanged()
      }, 2000)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-card-foreground mb-2">
            {isFirstLogin ? "Set Your Password" : "Change Password"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isFirstLogin
              ? "Please create a secure password to access your account"
              : "Update your password to keep your account secure"}
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {!isFirstLogin && (
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Password must contain: uppercase, lowercase, special character, and be at least 8 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          {errors.length > 0 && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <ul className="text-error text-sm space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {success && (
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm font-medium">
              Password updated successfully! Redirecting...
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:bg-primary/90 transition"
          >
            {isFirstLogin ? "Set Password" : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  )
}
