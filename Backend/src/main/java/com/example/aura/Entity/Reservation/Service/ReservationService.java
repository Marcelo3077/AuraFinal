package com.example.aura.Entity.Reservation.Service;

import com.example.aura.Entity.Reservation.DTO.ReservationParticipantDTO;
import com.example.aura.Entity.Reservation.DTO.ReservationRequestDTO;
import com.example.aura.Entity.Reservation.DTO.ReservationResponseDTO;
import com.example.aura.Entity.Reservation.DTO.ReservationServiceDTO;
import com.example.aura.Entity.Reservation.DTO.ReservationUpdateDTO;
import com.example.aura.Entity.Reservation.Domain.Reservation;
import com.example.aura.Entity.Reservation.Domain.ReservationStatus;
import com.example.aura.Entity.Reservation.Repository.ReservationRepository;
import com.example.aura.Entity.TechnicianService.Domain.TechnicianService;
import com.example.aura.Entity.TechnicianService.Domain.TechnicianServiceId;
import com.example.aura.Entity.TechnicianService.Repository.TechnicianServiceRepository;
import com.example.aura.Entity.User.Domain.User;
import com.example.aura.Entity.User.Repository.UserRepository;
import com.example.aura.Exception.ResourceNotFoundException;
import com.example.aura.Service.AuditService;
import com.example.aura.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.aura.Event.Reservation.ReservationCreatedEvent;
import com.example.aura.Event.Reservation.ReservationConfirmedEvent;
import com.example.aura.Event.Reservation.ReservationCompletedEvent;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDateTime;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final TechnicianServiceRepository technicianServiceRepository;
    private final com.example.aura.Entity.Technician.Repository.TechnicianRepository technicianRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;
    private final ModelMapper modelMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public ReservationResponseDTO createReservation(ReservationRequestDTO requestDTO) {
        String authenticatedEmail = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", authenticatedEmail));

        TechnicianServiceId tsId = new TechnicianServiceId(requestDTO.getTechnicianId(), requestDTO.getServiceId());
        TechnicianService technicianService = technicianServiceRepository.findById(tsId)
                .orElseThrow(() -> new ResourceNotFoundException("TechnicianService", "id",
                        requestDTO.getTechnicianId() + "-" + requestDTO.getServiceId()));

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setTechnicianService(technicianService);
        reservation.setReservationDate(LocalDate.now());
        reservation.setServiceDate(requestDTO.getServiceDate());
        reservation.setStartTime(requestDTO.getStartTime());
        reservation.setAddress(requestDTO.getAddress());
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());

        Reservation savedReservation = reservationRepository.save(reservation);
        eventPublisher.publishEvent(new ReservationCreatedEvent(
                this,
                savedReservation.getId(),
                user.getId(),
                technicianService.getTechnician().getId(),
                user.getEmail(),
                technicianService.getTechnician().getEmail(),
                technicianService.getService().getName(),
                savedReservation.getServiceDate().toString()
        ));

        return mapToResponseDTO(savedReservation);
    }

    @Transactional(readOnly = true)
    public ReservationResponseDTO getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));
        return mapToResponseDTO(reservation);
    }

    @Transactional(readOnly = true)
    public Page<ReservationResponseDTO> getAllReservations(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reservationRepository.findAll(pageable).map(this::mapToResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<ReservationResponseDTO> getReservationsByUserId(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reservationRepository.findByUserId(userId, pageable)
                .map(this::mapToResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<ReservationResponseDTO> getReservationsByTechnicianId(Long technicianId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reservationRepository.findByTechnicianServiceTechnicianId(technicianId, pageable)
                .map(this::mapToResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<ReservationResponseDTO> getReservationsByStatus(ReservationStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reservationRepository.findByStatus(status, pageable)
                .map(this::mapToResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<ReservationResponseDTO> getMyReservations(int page, int size) {
        String authenticatedEmail = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", authenticatedEmail));

        return getReservationsByUserId(user.getId(), page, size);
    }

    @Transactional(readOnly = true)
    public Page<ReservationResponseDTO> getMyTechnicianReservations(int page, int size) {
        String authenticatedEmail = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        var technician = technicianRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Technician", "email", authenticatedEmail));

        return getReservationsByTechnicianId(technician.getId(), page, size);
    }

    @Transactional
    public ReservationResponseDTO updateReservation(Long id, ReservationUpdateDTO updateDTO) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));

        if (updateDTO.getServiceDate() != null) {
            reservation.setServiceDate(updateDTO.getServiceDate());
        }
        if (updateDTO.getStartTime() != null) {
            reservation.setStartTime(updateDTO.getStartTime());
        }
        if (updateDTO.getEndTime() != null) {
            reservation.setEndTime(updateDTO.getEndTime());
        }
        if (updateDTO.getAddress() != null) {
            reservation.setAddress(updateDTO.getAddress());
        }
        if (updateDTO.getStatus() != null) {
            reservation.setStatus(updateDTO.getStatus());
        }

        reservation.setUpdatedAt(LocalDateTime.now());
        Reservation updatedReservation = reservationRepository.save(reservation);
        return mapToResponseDTO(updatedReservation);
    }

    @Transactional
    public ReservationResponseDTO confirmReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));

        enforceTechnicianOwnership(reservation);

        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setUpdatedAt(LocalDateTime.now());
        Reservation updatedReservation = reservationRepository.save(reservation);

        eventPublisher.publishEvent(new ReservationConfirmedEvent(
                this,
                updatedReservation.getId(),
                updatedReservation.getUser().getEmail(),
                updatedReservation.getUser().getPhone(),
                updatedReservation.getTechnicianService().getTechnician().getFirstName() + " " +
                        updatedReservation.getTechnicianService().getTechnician().getLastName(),
                updatedReservation.getServiceDate().toString()
        ));

        return mapToResponseDTO(updatedReservation);
    }

    @Transactional
    public ReservationResponseDTO rejectReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));

        enforceTechnicianOwnership(reservation);

        reservation.setStatus(ReservationStatus.REJECTED);
        reservation.setUpdatedAt(LocalDateTime.now());
        Reservation updatedReservation = reservationRepository.save(reservation);
        return mapToResponseDTO(updatedReservation);
    }

    @Transactional
    public ReservationResponseDTO cancelReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setUpdatedAt(LocalDateTime.now());
        Reservation updatedReservation = reservationRepository.save(reservation);
        return mapToResponseDTO(updatedReservation);
    }

    @Transactional
    public ReservationResponseDTO completeReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));

        enforceUserOwnership(reservation);

        reservation.setStatus(ReservationStatus.COMPLETED);
        reservation.setEndTime(java.time.LocalTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());
        Reservation updatedReservation = reservationRepository.save(reservation);
        eventPublisher.publishEvent(new ReservationCompletedEvent(
                this,
                updatedReservation.getId(),
                updatedReservation.getUser().getId(),
                updatedReservation.getTechnicianService().getTechnician().getId(),
                updatedReservation.getUser().getEmail()
        ));
        return mapToResponseDTO(updatedReservation);
    }

    @Transactional
    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));
        reservationRepository.delete(reservation);
    }

    private ReservationResponseDTO mapToResponseDTO(Reservation reservation) {
        ReservationResponseDTO dto = new ReservationResponseDTO();

        dto.setId(reservation.getId());

        dto.setUser(new ReservationParticipantDTO(
                reservation.getUser().getId(),
                reservation.getUser().getFirstName(),
                reservation.getUser().getLastName(),
                reservation.getUser().getEmail(),
                reservation.getUser().getPhone(),
                null,
                null,
                null,
                reservation.getUser().getRole().name(),
                reservation.getUser().getEnabled(),
                reservation.getUser().getRegisterDate() != null ? reservation.getUser().getRegisterDate().atStartOfDay() : null
        ));

        dto.setTechnician(new ReservationParticipantDTO(
                reservation.getTechnicianService().getTechnician().getId(),
                reservation.getTechnicianService().getTechnician().getFirstName(),
                reservation.getTechnicianService().getTechnician().getLastName(),
                reservation.getTechnicianService().getTechnician().getEmail(),
                reservation.getTechnicianService().getTechnician().getPhone(),
                reservation.getTechnicianService().getTechnician().getDescription(),
                0.0,
                0L,
                reservation.getTechnicianService().getTechnician().getRole().name(),
                reservation.getTechnicianService().getTechnician().getEnabled(),
                reservation.getTechnicianService().getTechnician().getRegisterDate() != null ?
                        reservation.getTechnicianService().getTechnician().getRegisterDate().atStartOfDay() : null
        ));

        dto.setService(new ReservationServiceDTO(
                reservation.getTechnicianService().getService().getId(),
                reservation.getTechnicianService().getService().getName(),
                reservation.getTechnicianService().getService().getDescription(),
                reservation.getTechnicianService().getService().getCategory(),
                reservation.getTechnicianService().getService().getSuggestedPrice()
        ));
        dto.setReservationDate(reservation.getReservationDate());
        dto.setServiceDate(reservation.getServiceDate());
        dto.setStartTime(reservation.getStartTime());
        dto.setEndTime(reservation.getEndTime());
        dto.setAddress(reservation.getAddress());
        dto.setStatus(reservation.getStatus());
        dto.setCreatedAt(reservation.getCreatedAt());
        dto.setUpdatedAt(reservation.getUpdatedAt());

        Double totalAmount = reservation.getPayments() != null ?
                reservation.getPayments().stream()
                        .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                        .sum() : 0.0;
        dto.setFinalPrice(totalAmount);

        dto.setHasReview(reservation.getReview() != null);

        return dto;
    }

    private void enforceTechnicianOwnership(Reservation reservation) {
        String authenticatedEmail = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        if (!reservation.getTechnicianService().getTechnician().getEmail().equalsIgnoreCase(authenticatedEmail)) {
            throw new SecurityException("Technician not authorized to modify this reservation");
        }
    }

    private void enforceUserOwnership(Reservation reservation) {
        String authenticatedEmail = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        if (!reservation.getUser().getEmail().equalsIgnoreCase(authenticatedEmail)) {
            throw new SecurityException("User not authorized to complete this reservation");
        }

        if (reservation.getStatus() != ReservationStatus.CONFIRMED &&
                reservation.getStatus() != ReservationStatus.IN_PROGRESS) {
            throw new IllegalStateException("Only confirmed reservations can be completed by the customer");
        }
    }
}
