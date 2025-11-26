// Enums
export enum Role {
    USER = 'USER',
    TECHNICIAN = 'TECHNICIAN',
    ADMIN = 'ADMIN',
    SUPERADMIN = 'SUPERADMIN'
}

export enum ReservationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum ServiceCategory {
    PLUMBING = 'PLUMBING',
    ELECTRICAL = 'ELECTRICAL',
    CARPENTRY = 'CARPENTRY',
    CLEANING = 'CLEANING',
    PAINTING = 'PAINTING',
    GARDENING = 'GARDENING',
    OTHER = 'OTHER'
}

// Interfaces
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: Role;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Technician extends User {
    bio?: string;
    experience?: number;
    rating?: number;
    servicesOffered: ServiceCategory[];
    certifications?: string[];
    availability?: boolean;
}

export interface Service {
    id: number;
    name: string;
    description: string;
    category: ServiceCategory;
    price: number;
    duration: number;
    imageUrl?: string;
    technician: Technician;
    createdAt: string;
    updatedAt: string;
}

export interface Reservation {
    id: number;
    user: User;
    technician: Technician;
    service: Service;
    scheduledDate: string;
    status: ReservationStatus;
    address: string;
    notes?: string;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
}

export interface Payment {
    id: number;
    reservation: Reservation;
    amount: number;
    paymentMethod: string;
    status: string;
    transactionId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    id: number;
    user: User;
    technician: Technician;
    reservation: Reservation;
    rating: number;
    comment?: string;
    createdAt: string;
    updatedAt: string;
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
    currentPage: number;
    pageSize: number;
}

// Auth Types
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
}

export interface AuthResponse {
    token: string;
    user: User;
}
