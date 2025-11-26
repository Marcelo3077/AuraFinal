export enum Role {
    USER = 'USER',
    TECHNICIAN = 'TECHNICIAN',
    ADMIN = 'ADMIN',
    SUPERADMIN = 'SUPERADMIN'
}

export enum ReservationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    REJECTED = 'REJECTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum ServiceCategory {
    PLUMBING = 'PLUMBING',
    ELECTRICITY = 'ELECTRICITY',
    CARPENTRY = 'CARPENTRY',
    PAINTING = 'PAINTING',
    CLEANING = 'CLEANING',
    APPLIANCE_REPAIR = 'APPLIANCE_REPAIR',
    HVAC = 'HVAC',
    IT_SUPPORT = 'IT_SUPPORT',
    LOCKSMITH = 'LOCKSMITH',
    GENERAL_MAINTENANCE = 'GENERAL_MAINTENANCE',
    OTHER = 'OTHER'
}

export enum PaymentMethod {
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    YAPE = 'YAPE',
    PLIN = 'PLIN',
    CASH = 'CASH'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    REFUNDED = 'REFUNDED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED'
}

// Base User Interface
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: Role;
    imageUrl?: string;
    isActive?: boolean;
    createdAt: string;
    updatedAt?: string;
}

// Technician Interface
export interface Technician extends User {
    description?: string;
    specialties: ServiceCategory[];
    averageRating?: number;
    totalReviews?: number;
    certifications?: string[];
    services?: Service[];
}

// Service Interface
export interface Service {
    id: number;
    name: string;
    description: string;
    category: ServiceCategory;
    suggestedPrice?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    technician?: Technician;
}

// Reservation Interface
export interface Reservation {
    id: number;
    user: User;
    technician: Technician;
    service: Service;
    serviceDate: string;
    startTime: string;
    scheduledDate?: string; // For backward compatibility
    address: string;
    status: ReservationStatus;
    technicianBaseRate?: number;
    finalPrice?: number;
    totalPrice?: number; // For backward compatibility
    notes?: string;
    createdAt: string;
    updatedAt?: string;
}

// Payment Interface
export interface Payment {
    id: number;
    reservation: Reservation;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    transactionId?: string;
    paymentDate: string;
    createdAt?: string;
    updatedAt?: string;
}

// Review Interface
export interface Review {
    id: number;
    reservation?: Reservation;
    reservationId?: number;
    user?: User;
    userId?: number;
    userName?: string;
    technician?: Technician;
    technicianId?: number;
    technicianName?: string;
    serviceId?: number;
    serviceName?: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage?: number;
    number?: number;
    pageSize?: number;
    size?: number;
    first?: boolean;
    last?: boolean;
}

// Auth Request/Response Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role: Role;
    description?: string;
    specialties?: ServiceCategory[];
}

export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: User;
    userId?: number;
    type?: string;
}

// Create/Update Request Types
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
    amount: number;
    paymentMethod: PaymentMethod;
}

export interface CreateReviewRequest {
    reservationId: number;
    rating: number;
    comment: string;
}

// Error Types
export interface ApiError {
    timestamp?: string;
    status: number;
    error: string;
    message: string;
    path?: string;
    details?: Record<string, string>;
}