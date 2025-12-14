import axiosInstance from "@/api/axios";
import type { AxiosInstance } from "axios";
import type {
  Service,
  BookingServicesResponse,
  GetAppointmentsResponse,
  BookingHoursResponse,
  CreateAppointmentSuccessResponse,
  CreateAppointmentRequest,
} from "@/types/api";

export function useApi(): AxiosInstance {
  return axiosInstance;
}

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
