package com.example.aura.Entity.Payment.Repository;

import com.example.aura.Entity.Payment.Domain.Payment;
import com.example.aura.Entity.Payment.Domain.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Page<Payment> findByReservationId(Long reservationId, Pageable pageable);
    List<Payment> findByPaymentStatus(PaymentStatus status);
    Page<Payment> findByReservationUserId(Long userId, Pageable pageable);
    Page<Payment> findByReservationTechnicianServiceTechnicianId(Long technicianId, Pageable pageable);
}
