import axiosInstance from "@/api/axios";
import type {
  Service,
  BookingServicesResponse,
  GetAppointmentsResponse,
  BookingHoursResponse,
  CreateAppointmentSuccessResponse,
  CreateAppointmentRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/api";

const apiUrl = import.meta.env.VITE_BASEURI as string;

// GET /api/services
export async function getServices(): Promise<Service[]> {
  const { data } = await axiosInstance.get<BookingServicesResponse>(
    `${apiUrl}/api/services`
  );
  return data.services;
}

// GET /api/appointments
export async function getAppointments(): Promise<GetAppointmentsResponse> {
  const { data } = await axiosInstance.get<GetAppointmentsResponse>(
    `${apiUrl}/api/appointments`
  );
  return data;
}

// GET /api/booking-hours
export async function getBookingHours(): Promise<BookingHoursResponse> {
  const { data } = await axiosInstance.get<BookingHoursResponse>(
    `${apiUrl}/api/booking-hours`
  );
  return data;
}

// POST /api/appointments
export async function createAppointment(
  payload: CreateAppointmentRequest
): Promise<CreateAppointmentSuccessResponse> {
  const { data } = await axiosInstance.post<CreateAppointmentSuccessResponse>(
    `${apiUrl}/api/appointments`,
    payload
  );
  return data;
}

// DELETE /api/appointments/:id
export async function deleteAppointment(appointmentId: number): Promise<void> {
  await axiosInstance.delete(`${apiUrl}/api/appointments/${appointmentId}`);
}

// POST /api/login
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  // Prima otteniamo il CSRF cookie
  await axiosInstance.get(`${apiUrl}/sanctum/csrf-cookie`);
  // Poi facciamo il login
  const { data } = await axiosInstance.post<LoginResponse>(
    `${apiUrl}/api/login`,
    payload
  );
  return data;
}

// DELETE /api/logout
export async function logout(): Promise<void> {
  // Prima otteniamo il CSRF cookie
  await axiosInstance.get(`${apiUrl}/sanctum/csrf-cookie`);
  // Poi facciamo il logout
  await axiosInstance.delete(`${apiUrl}/api/logout`);
}

// POST /api/register
export async function register(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  // Prima otteniamo il CSRF cookie
  await axiosInstance.get(`${apiUrl}/sanctum/csrf-cookie`);
  // Poi facciamo la registrazione
  await axiosInstance.post(`${apiUrl}/api/register`, payload);
}
