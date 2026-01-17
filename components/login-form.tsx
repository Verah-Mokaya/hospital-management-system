"use client"

import type React from "react"

import { useState } from "react"
import { hashPassword, verifyPassword, isPasswordExpired, getDaysUntilExpiry } from "@/lib/password-utils"
import { PasswordChange } from "./features/password-change"

export function LoginForm({ setUser }: { setUser: (user: any) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [passwordChangeNeeded, setPasswordChangeNeeded] = useState(false)
  const [pendingUser, setPendingUser] = useState<any>(null)

  const demoUsers = [
    {
      id: "1",
      email: "admin@hospital.com",
      passwordHash: hashPassword("Admin@123"),
      name: "Admin User",
      role: "admin",
      firstLogin: false,
      passwordExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: "2",
      email: "doctor@hospital.com",
      passwordHash: hashPassword("Doctor@123"),
      name: "Dr. John Smith",
      role: "doctor",
      firstLogin: false,
      passwordExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: "3",
      email: "nurse@hospital.com",
      passwordHash: hashPassword("Nurse@123"),
      name: "Sarah Johnson",
      role: "nurse",
      firstLogin: false,
      passwordExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: "4",
      email: "receptionist@hospital.com",
      passwordHash: hashPassword("Receptionist@123"),
      name: "Emma Davis",
      role: "receptionist",
      firstLogin: false,
      passwordExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: "5",
      email: "attendant@hospital.com",
      passwordHash: hashPassword("Attendant@123"),
      name: "James Brown",
      role: "attendant",
      firstLogin: false,
      passwordExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: "6",
      email: "finance@hospital.com",
      passwordHash: hashPassword("Finance@123"),
      name: "Mike Wilson",
      role: "finance",
      firstLogin: false,
      passwordExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: "7",
      email: "lab@hospital.com",
      passwordHash: hashPassword("Lab@123"),
      name: "Dr. Lisa Chen",
      role: "lab",
      firstLogin: false,
      passwordExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: "8",
      email: "cleaner@hospital.com",
      passwordHash: hashPassword("Cleaner@123"),
      name: "Maria Garcia",
      role: "cleaner",
      firstLogin: false,
      passwordExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Check demo users first
    let user = demoUsers.find((u) => u.email === email)

    if (!user) {
      // Check created employee accounts
      const allEmployees = JSON.parse(localStorage.getItem("hospital_all_employees") || "[]")
      user = allEmployees.find((u: any) => u.email === email)
    }

    if (!user) {
      setError("Invalid email or password")
      return
    }

    // Verify password
    const passwordHash = hashPassword(password)
    if (user.passwordHash !== passwordHash) {
      setError("Invalid email or password")
      return
    }

    // Check if password expired
    if (user.passwordExpiresAt && isPasswordExpired(user.passwordExpiresAt)) {
      setError("Your password has expired. Please change it to continue.")
      setPendingUser(user)
      setPasswordChangeNeeded(true)
      return
    }

    // Check if first login
    if (user.firstLogin) {
      setPendingUser(user)
      setPasswordChangeNeeded(true)
      return
    }

    // Check password expiry warning
    const daysLeft = getDaysUntilExpiry(user.passwordExpiresAt || Date.now())
    if (daysLeft <= 7) {
      console.log("[v0] Password expires in", daysLeft, "days")
    }

    // Login successful
    localStorage.setItem("hospital_user", JSON.stringify(user))
    setUser(user)
  }

  if (passwordChangeNeeded && pendingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="absolute top-4 left-4">
          <button
            onClick={() => {
              setPasswordChangeNeeded(false)
              setPendingUser(null)
              setEmail("")
              setPassword("")
              setError("")
            }}
            className="text-muted-foreground hover:text-foreground transition"
          >
            ← Back to Login
          </button>
        </div>
        <PasswordChange
          employeeId={pendingUser.id}
          employeeName={pendingUser.name}
          isFirstLogin={pendingUser.firstLogin}
          onPasswordChanged={() => {
            const updatedUser = {
              ...pendingUser,
              firstLogin: false,
              passwordExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
            }
            localStorage.setItem("hospital_user", JSON.stringify(updatedUser))
            setUser(updatedUser)
            setPasswordChangeNeeded(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg border border-border p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">H</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-card-foreground">Hospital MS</h1>
            <p className="text-muted-foreground text-sm mt-2">Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="admin@hospital.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:bg-primary/90 transition"
            >
              Login
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3 font-semibold">Demo Credentials</p>
            <div className="space-y-2 text-xs">
              <p className="text-muted-foreground">
                <span className="font-medium">Admin:</span> admin@hospital.com / Admin@123
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Doctor:</span> doctor@hospital.com / Doctor@123
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Nurse:</span> nurse@hospital.com / Nurse@123
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Receptionist:</span> receptionist@hospital.com / Receptionist@123
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Attendant:</span> attendant@hospital.com / Attendant@123
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Finance:</span> finance@hospital.com / Finance@123
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Lab:</span> lab@hospital.com / Lab@123
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Cleaner:</span> cleaner@hospital.com / Cleaner@123
              </p>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
              <strong>Note:</strong> Only Admin can create new employee accounts with universal passwords. Employees must change their password on first login.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
