const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("access_token", token);
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem("access_token");
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("access_token");
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "API request failed");
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<any>("POST", "/auth/login", {
      email,
      password,
    });
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    return response;
  }

  async register(email: string, name: string, role: string, password: string) {
    return this.request("POST", "/auth/register", {
      email,
      password,
      name,
      role,
    });
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    return this.request("POST", "/auth/change-password", {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  }

  // Patient endpoints
  async registerPatient(patient: any) {
    return this.request("POST", "/patients/register", patient);
  }

  async getAllPatients(skip = 0, limit = 100) {
    return this.request("GET", `/patients/?skip=${skip}&limit=${limit}`);
  }

  async getPatient(patientId: number) {
    return this.request("GET", `/patients/${patientId}`);
  }

  async updatePatient(patientId: number, patient: any) {
    return this.request("PUT", `/patients/${patientId}`, patient);
  }

  async deletePatient(patientId: number) {
    return this.request("DELETE", `/patients/${patientId}`);
  }

  // Employee endpoints
  async clockIn(employeeId: number) {
    return this.request("POST", "/employees/clock-in", {
      employee_id: employeeId,
    });
  }

  async clockOut(employeeId: number) {
    return this.request("POST", "/employees/clock-out", {
      employee_id: employeeId,
    });
  }

  async getClockRecords(employeeId: number) {
    return this.request("GET", `/employees/clock-records/${employeeId}`);
  }

  async getAllEmployees(skip = 0, limit = 100) {
    return this.request("GET", `/employees/?skip=${skip}&limit=${limit}`);
  }

  async getEmployee(employeeId: number) {
    return this.request("GET", `/employees/${employeeId}`);
  }

  // Appointment endpoints
  async createAppointment(appointment: any) {
    return this.request("POST", "/appointments/", appointment);
  }

  async getAllAppointments(skip = 0, limit = 100) {
    return this.request("GET", `/appointments/?skip=${skip}&limit=${limit}`);
  }

  async getAppointment(appointmentId: number) {
    return this.request("GET", `/appointments/${appointmentId}`);
  }

  async updateAppointment(appointmentId: number, appointment: any) {
    return this.request("PUT", `/appointments/${appointmentId}`, appointment);
  }

  async deleteAppointment(appointmentId: number) {
    return this.request("DELETE", `/appointments/${appointmentId}`);
  }

  // Lab endpoints
  async createLabRecord(record: any) {
    return this.request("POST", "/lab/records", record);
  }

  async getAllLabRecords(skip = 0, limit = 100) {
    return this.request("GET", `/lab/records?skip=${skip}&limit=${limit}`);
  }

  async getLabRecord(recordId: number) {
    return this.request("GET", `/lab/records/${recordId}`);
  }

  async updateLabRecord(recordId: number, record: any) {
    return this.request("PUT", `/lab/records/${recordId}`, record);
  }

  async getPatientLabRecords(patientId: number) {
    return this.request("GET", `/lab/patient/${patientId}`);
  }

  // Pharmacy endpoints
  async addMedicine(medicine: any) {
    return this.request("POST", "/pharmacy/", medicine);
  }

  async getAllMedicines(skip = 0, limit = 100) {
    return this.request("GET", `/pharmacy/?skip=${skip}&limit=${limit}`);
  }

  async getMedicine(medicineId: number) {
    return this.request("GET", `/pharmacy/${medicineId}`);
  }

  async updateMedicine(medicineId: number, medicine: any) {
    return this.request("PUT", `/pharmacy/${medicineId}`, medicine);
  }

  async deleteMedicine(medicineId: number) {
    return this.request("DELETE", `/pharmacy/${medicineId}`);
  }

  async getLowStockMedicines() {
    return this.request("GET", "/pharmacy/low-stock/alert");
  }

  // Inventory endpoints
  async addInventoryItem(item: any) {
    return this.request("POST", "/inventory/", item);
  }

  async getAllInventoryItems(skip = 0, limit = 100) {
    return this.request("GET", `/inventory/?skip=${skip}&limit=${limit}`);
  }

  async getInventoryItem(itemId: number) {
    return this.request("GET", `/inventory/${itemId}`);
  }

  async updateInventoryItem(itemId: number, item: any) {
    return this.request("PUT", `/inventory/${itemId}`, item);
  }

  async deleteInventoryItem(itemId: number) {
    return this.request("DELETE", `/inventory/${itemId}`);
  }

  async getLowStockItems() {
    return this.request("GET", "/inventory/low-stock/alert");
  }

  // Cleaning endpoints
  async createCleaningLog(log: any) {
    return this.request("POST", "/cleaning/logs", log);
  }

  async getAllCleaningLogs(skip = 0, limit = 100) {
    return this.request("GET", `/cleaning/logs?skip=${skip}&limit=${limit}`);
  }

  async getCleaningLog(logId: number) {
    return this.request("GET", `/cleaning/logs/${logId}`);
  }

  async updateCleaningLog(logId: number, log: any) {
    return this.request("PUT", `/cleaning/logs/${logId}`, log);
  }

  async getCleanerHistory(cleanerId: number) {
    return this.request("GET", `/cleaning/history/${cleanerId}`);
  }

  // Reminder endpoints
  async createReminder(reminder: any) {
    return this.request("POST", "/reminders/", reminder);
  }

  async getAllReminders(skip = 0, limit = 100) {
    return this.request("GET", `/reminders/?skip=${skip}&limit=${limit}`);
  }

  async getReminder(reminderId: number) {
    return this.request("GET", `/reminders/${reminderId}`);
  }

  async getPendingReminders(patientId: number) {
    return this.request("GET", `/reminders/pending/patient/${patientId}`);
  }

  async markReminderSent(reminderId: number) {
    return this.request("POST", `/reminders/${reminderId}/mark-sent`, {});
  }
}

export const apiClient = new ApiClient();
