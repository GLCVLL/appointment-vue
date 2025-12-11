// ============================================
// GET /api/appointments (index)
// ============================================
export interface AppointmentListItem {
  id: number;
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:mm
  services: string[]; // Array of service names
}
export type GetAppointmentsResponse = AppointmentListItem[];

// ============================================
// POST /api/appointments (store)
// ============================================
export type CreateAppointmentSuccessResponse = number;

// ============================================
// GET /api/booking-hours (getBookingHours)
// ============================================
export interface TimeSlot {
  hour: string; // Format: HH:mm
}

export interface SlotDay {
  date: string; // Format: YYYY-MM-DD
  slots: TimeSlot[];
}

export interface BookingHoursResponse {
  slotDays: SlotDay[];
  closedDays: string[]; // Array of dates in format YYYY-MM-DD
}

// ============================================
// GET /api/services (index)
// ============================================
export interface Category {
  id: number;
  name: string;
}

export interface Service {
  id: number;
  category_id: number;
  name: string;
  duration: string; // Format: HH:mm:ss
  is_available: boolean;
}

export interface BookingServicesResponse {
  categories: Category[];
  services: Service[];
}
