package com.example.aura.Entity.Payment.Service;

import com.example.aura.Entity.Payment.DTO.PaymentReservationDTO;
import com.example.aura.Entity.Payment.DTO.PaymentRequestDTO;
import com.example.aura.Entity.Payment.DTO.PaymentResponseDTO;
import com.example.aura.Entity.Payment.Domain.Payment;
import com.example.aura.Entity.Payment.Domain.PaymentStatus;
import com.example.aura.Entity.Payment.Repository.PaymentRepository;
import com.example.aura.Entity.Reservation.DTO.ReservationServiceDTO;
import com.example.aura.Entity.Reservation.Domain.Reservation;
import com.example.aura.Entity.Reservation.Repository.ReservationRepository;
import com.example.aura.Entity.User.Domain.User;
import com.example.aura.Entity.User.Repository.UserRepository;
import com.example.aura.Event.Payment.PaymentCompletedEvent;
import com.example.aura.Exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public PaymentResponseDTO createPayment(PaymentRequestDTO requestDTO) {
        Reservation reservation = reservationRepository.findById(requestDTO.getReservationId())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", requestDTO.getReservationId()));

        Payment payment = new Payment();
        payment.setReservation(reservation);
        payment.setAmount(requestDTO.getAmount());
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentMethod(requestDTO.getPaymentMethod());
        payment.setPaymentStatus(PaymentStatus.COMPLETED);

        Payment savedPayment = paymentRepository.save(payment);
        eventPublisher.publishEvent(new PaymentCompletedEvent(
                this,
                savedPayment.getId(),
                savedPayment.getReservation().getId(),
                savedPayment.getReservation().getUser().getEmail(),
                savedPayment.getAmount(),
                savedPayment.getPaymentMethod().toString()
        ));
        return mapToResponseDTO(savedPayment);
    }

    @Transactional(readOnly = true)
    public PaymentResponseDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        return mapToResponseDTO(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PaymentResponseDTO> getPaymentsForCurrentUser(int page, int size) {
        String authenticatedEmail = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", authenticatedEmail));

        Pageable pageable = PageRequest.of(page, size);
        return paymentRepository.findByReservationUserId(user.getId(), pageable)
                .map(this::mapToResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<PaymentResponseDTO> getPaymentsByReservationId(Long reservationId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return paymentRepository.findByReservationId(reservationId, pageable)
                .map(this::mapToResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponseDTO> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByPaymentStatus(status).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponseDTO processPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        payment.setPaymentStatus(PaymentStatus.COMPLETED);
        payment.setPaymentDate(LocalDate.now());

        Payment processedPayment = paymentRepository.save(payment);
        eventPublisher.publishEvent(new PaymentCompletedEvent(
                this,
                processedPayment.getId(),
                processedPayment.getReservation().getId(),
                processedPayment.getReservation().getUser().getEmail(),
                processedPayment.getAmount(),
                processedPayment.getPaymentMethod().toString()
        ));
        return mapToResponseDTO(processedPayment);
    }

    @Transactional
    public PaymentResponseDTO failPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        payment.setPaymentStatus(PaymentStatus.FAILED);
        Payment failedPayment = paymentRepository.save(payment);
        return mapToResponseDTO(failedPayment);
    }

    @Transactional
    public PaymentResponseDTO refundPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        if (payment.getPaymentStatus() != PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot refund a payment that is not completed");
        }

        payment.setPaymentStatus(PaymentStatus.REFUNDED);
        Payment refundedPayment = paymentRepository.save(payment);
        return mapToResponseDTO(refundedPayment);
    }

    @Transactional
    public PaymentResponseDTO cancelPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        payment.setPaymentStatus(PaymentStatus.CANCELLED);
        Payment cancelledPayment = paymentRepository.save(payment);
        return mapToResponseDTO(cancelledPayment);
    }

    @Transactional
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        paymentRepository.delete(payment);
    }

    private PaymentResponseDTO mapToResponseDTO(Payment payment) {
        Reservation reservation = payment.getReservation();

        Double totalAmount = reservation.getPayments() != null ?
                reservation.getPayments().stream()
                        .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                        .sum() : 0.0;

        if ((totalAmount == null || totalAmount == 0.0) && payment.getAmount() != null) {
            totalAmount = payment.getAmount();
        }

        Double technicianBaseRate = reservation.getTechnicianService().getBaseRate();
        Double resolvedTotal = (totalAmount != null && totalAmount > 0)
                ? totalAmount
                : technicianBaseRate;

        PaymentReservationDTO reservationDTO = new PaymentReservationDTO(
                reservation.getId(),
                new ReservationServiceDTO(
                        reservation.getTechnicianService().getService().getId(),
                        reservation.getTechnicianService().getService().getName(),
                        reservation.getTechnicianService().getService().getDescription(),
                        reservation.getTechnicianService().getService().getCategory(),
                        reservation.getTechnicianService().getService().getSuggestedPrice()
                ),
                reservation.getStatus(),
                reservation.getServiceDate(),
                reservation.getStartTime(),
                reservation.getAddress(),
                technicianBaseRate,
                resolvedTotal
        );

        return new PaymentResponseDTO(
                payment.getId(),
                reservationDTO,
                payment.getAmount(),
                payment.getPaymentDate(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus()
        );
    }
}
