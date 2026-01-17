export function generateUniversalPassword(): string {
  // Universal password that meets all requirements: Pass@123
  return "Pass@123"
}

export interface PasswordValidation {
  valid: boolean
  errors: string[]
}

export function validatePassword(password: string, employeeName: string): PasswordValidation {
  const errors: string[] = []

  // Check minimum length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least 1 uppercase letter")
  }

  // Check for lowercase
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least 1 lowercase letter")
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least 1 special character")
  }

  // Check if name is in password (case-insensitive)
  const nameParts = employeeName.toLowerCase().split(" ")
  for (const part of nameParts) {
    if (part.length > 2 && password.toLowerCase().includes(part)) {
      errors.push("Password cannot contain your name")
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export interface EmployeeAccount {
  id: string
  name: string
  email: string
  role: string
  phone: string
  salary: number
  status: "active" | "inactive"
  password: string
  passwordHash: string
  firstLogin: boolean
  passwordChangedAt: number // timestamp
  passwordExpiresAt: number // timestamp
}

export function hashPassword(password: string): string {
  // Simple hash for demo (in production, use bcrypt)
  return Buffer.from(password).toString("base64")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function getPasswordExpiryDate(): number {
  // 30 days from now
  return Date.now() + 30 * 24 * 60 * 60 * 1000
}

export function isPasswordExpired(expiryDate: number): boolean {
  return Date.now() > expiryDate
}

export function getDaysUntilExpiry(expiryDate: number): number {
  const daysMs = expiryDate - Date.now()
  return Math.ceil(daysMs / (24 * 60 * 60 * 1000))
}
