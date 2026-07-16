package com.exportpro.backend.repository;

import com.exportpro.backend.model.Port;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortRepository extends JpaRepository<Port, Long> {
}