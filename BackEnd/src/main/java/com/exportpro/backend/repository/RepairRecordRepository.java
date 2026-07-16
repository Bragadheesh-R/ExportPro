package com.exportpro.backend.repository;

import com.exportpro.backend.model.RepairRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepairRecordRepository extends JpaRepository<RepairRecord, Long> {
    List<RepairRecord> findByCarId(Long carId);
}