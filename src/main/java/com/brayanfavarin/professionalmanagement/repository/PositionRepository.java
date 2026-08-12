package com.brayanfavarin.professionalmanagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.brayanfavarin.professionalmanagement.model.Position;

public interface PositionRepository extends JpaRepository<Position, Long> {
    Page<Position> findByNameContainingIgnoreCase(String name, Pageable pageable);
    boolean existsByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
