package com.exportpro.backend.repository;

import com.exportpro.backend.model.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByCarId(Long carId);
    List<Inquiry> findByCustomerEmail(String email);
}