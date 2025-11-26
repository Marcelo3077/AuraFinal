package com.example.aura.Entity.Review.DTO;

import com.example.aura.Entity.Review.Domain.ReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {
    private Long id;
    private Long reservationId;
    private Long userId;
    private String userName;
    private Long technicianId;
    private String technicianName;
    private Long serviceId;
    private String serviceName;
    private String comment;
    private Integer rating;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private ReviewStatus status;
}
