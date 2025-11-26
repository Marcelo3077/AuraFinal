package com.example.aura.Entity.Reservation.DTO;

import com.example.aura.Entity.Service.Domain.ServiceCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationServiceDTO {
    private Long id;
    private String name;
    private String description;
    private ServiceCategory category;
    private Double suggestedPrice;
}
