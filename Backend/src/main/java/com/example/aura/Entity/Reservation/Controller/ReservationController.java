package com.example.aura.Entity.Reservation.Controller;

import com.example.aura.Entity.Reservation.DTO.ReservationRequestDTO;
import com.example.aura.Entity.Reservation.DTO.ReservationResponseDTO;
import com.example.aura.Entity.Reservation.Service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReservationResponseDTO> createReservation(@Valid @RequestBody ReservationRequestDTO requestDTO) {
        ReservationResponseDTO response = reservationService.createReservation(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'TECHNICIAN', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ReservationResponseDTO> getReservationById(@PathVariable Long id) {
        ReservationResponseDTO response = reservationService.getReservationById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Page<ReservationResponseDTO>> getAllReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReservationResponseDTO> response = reservationService.getAllReservations(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Page<ReservationResponseDTO>> getReservationsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReservationResponseDTO> response = reservationService.getReservationsByUserId(userId, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<ReservationResponseDTO>> getMyReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReservationResponseDTO> response = reservationService.getMyReservations(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/technician/{technicianId}")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Page<ReservationResponseDTO>> getReservationsByTechnicianId(
            @PathVariable Long technicianId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReservationResponseDTO> response = reservationService.getReservationsByTechnicianId(technicianId, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my/technician")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<Page<ReservationResponseDTO>> getMyTechnicianReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReservationResponseDTO> response = reservationService.getMyTechnicianReservations(page, size);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ReservationResponseDTO> confirmReservation(@PathVariable Long id) {
        ReservationResponseDTO response = reservationService.confirmReservation(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ReservationResponseDTO> rejectReservation(@PathVariable Long id) {
        ReservationResponseDTO response = reservationService.rejectReservation(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ReservationResponseDTO> cancelReservation(@PathVariable Long id) {
        ReservationResponseDTO response = reservationService.cancelReservation(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ReservationResponseDTO> completeReservation(@PathVariable Long id) {
        ReservationResponseDTO response = reservationService.completeReservation(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}