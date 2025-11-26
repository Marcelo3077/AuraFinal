package com.example.aura.Entity.Payment.DTO;

import com.example.aura.Entity.Reservation.DTO.ReservationServiceDTO;
import com.example.aura.Entity.Reservation.Domain.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentReservationDTO {
    private Long id;
    private ReservationServiceDTO service;
    private ReservationStatus status;
    private LocalDate serviceDate;
    private LocalTime startTime;
    private String address;
    private Double technicianBaseRate;
    private Double finalPrice;
}
