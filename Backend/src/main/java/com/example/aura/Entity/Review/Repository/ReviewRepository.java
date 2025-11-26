package com.example.aura.Entity.Review.Repository;

import com.example.aura.Entity.Review.Domain.Review;
import com.example.aura.Entity.Review.Domain.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByStatus(ReviewStatus status);
    List<Review> findByRating(Integer rating);
    List<Review> findByReservation_User_Id(Long userId);
    List<Review> findByReservation_User_Email(String email);
    List<Review> findByReservation_TechnicianService_Technician_Id(Long technicianId);
    List<Review> findByReservation_TechnicianService_Technician_Email(String email);
}
