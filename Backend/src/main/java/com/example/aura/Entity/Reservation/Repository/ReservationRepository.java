package com.example.aura.Entity.Reservation.Repository;

import com.example.aura.Entity.Reservation.Domain.Reservation;
import com.example.aura.Entity.Reservation.Domain.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByStatus(ReservationStatus status);
    List<Reservation> findByServiceDateBetween(LocalDate start, LocalDate end);
    List<Reservation> findByTechnicianServiceTechnicianId(Long technicianId);

    Page<Reservation> findByUserId(Long userId, Pageable pageable);

    Page<Reservation> findByTechnicianServiceTechnicianId(Long technicianId, Pageable pageable);

    Page<Reservation> findByStatus(ReservationStatus status, Pageable pageable);
}
