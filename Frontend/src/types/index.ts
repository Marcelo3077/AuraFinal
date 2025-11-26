// Enums
export enum Role {
  USER = 'USER',
  TECHNICIAN = 'TECHNICIAN',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN'
}

export enum ServiceCategory {
  PLUMBING = 'PLUMBING',
  ELECTRICAL = 'ELECTRICAL',
  CARPENTRY = 'CARPENTRY',
  PAINTING = 'PAINTING',
  CLEANING = 'CLEANING',
  GARDENING = 'GARDENING',
  HVAC = 'HVAC',
  APPLIANCE_REPAIR = 'APPLIANCE_REPAIR'
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  YAPE = 'YAPE',
  PLIN = 'PLIN',
  CASH = 'CASH'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// Base Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface Technician {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: Role.TECHNICIAN;
  phone: string;
  description: string;
  specialties: string[];
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: string;
  certifications?: Certification[];
  services?: Service[];
}

export interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phone?: string;
  createdAt: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  category: ServiceCategory;
  suggestedPrice?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface TechnicianServiceLink {
  technicianId: number;
  technicianName: string;
  serviceId: number;
  serviceName: string;
  baseRate: number;
  totalReservations: number;
}

export interface Reservation {
  id: number;
  user: User;
  technician: Technician;
  service: Service;
  serviceDate: string;
  startTime: string;
  address: string;
  status: ReservationStatus;
  finalPrice?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  reservation: Reservation;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface Review {
  id: number;
  reservation: Reservation;
  user: User;
  technician: Technician;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SupportTicket {
  id: number;
  reservation?: Reservation;
  user: User;
  assignedAdmin?: Admin;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: number;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  technicianId: number;
}

export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  senderType: 'USER' | 'TECHNICIAN';
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Chat {
  id: number;
  userId: number;
  technicianId: number;
  reservationId?: number;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// DTOs for API requests/responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type?: string;
  refreshToken?: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
}

export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  description?: string;
  specialties?: string[];
}

export interface RegisterTechnicianRequest extends RegisterUserRequest {
  description: string;
  specialties: string[];
  role: Role.TECHNICIAN;
}

export interface CreateReservationRequest {
  technicianId: number;
  serviceId: number;
  serviceDate: string;
  startTime: string;
  address: string;
  notes?: string;
}

export interface CreatePaymentRequest {
  reservationId: number;
  method: PaymentMethod;
  amount: number;
}

export interface CreateReviewRequest {
  reservationId: number;
  rating: number;
  comment: string;
}

export interface CreateTicketRequest {
  reservationId?: number;
  subject: string;
  description: string;
  priority: TicketPriority;
}

// Paginated Response
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// API Error Response
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  details?: Record<string, string>;
}
