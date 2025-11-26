package com.example.aura.Entity.Reservation.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationParticipantDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String description;
    private Double averageRating;
    private Long totalReviews;
    private String role;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
