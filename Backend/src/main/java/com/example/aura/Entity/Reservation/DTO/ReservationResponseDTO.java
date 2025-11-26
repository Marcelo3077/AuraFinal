package com.example.aura.Entity.Reservation.DTO;

import com.example.aura.Entity.Reservation.Domain.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponseDTO {
    private Long id;
    private ReservationParticipantDTO user;
    private ReservationParticipantDTO technician;
    private ReservationServiceDTO service;
    private Double technicianBaseRate;
    private LocalDate reservationDate;
    private LocalDate serviceDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String address;
    private ReservationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Double finalPrice;
    private Boolean hasReview;
}
