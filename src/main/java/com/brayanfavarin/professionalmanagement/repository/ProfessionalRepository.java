package com.brayanfavarin.professionalmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import com.brayanfavarin.professionalmanagement.dto.dashboard.DepartmentProfessionalCountResponse;
import com.brayanfavarin.professionalmanagement.dto.dashboard.PositionProfessionalCountResponse;
import com.brayanfavarin.professionalmanagement.enums.ProfessionalStatus;
import com.brayanfavarin.professionalmanagement.model.Professional;

public interface ProfessionalRepository extends JpaRepository<Professional, Long>, JpaSpecificationExecutor<Professional> {
    boolean existsByDepartmentId(Long departmentId);
    boolean existsByPositionId(Long positionId);

    @Override
    @EntityGraph(attributePaths = {"department", "position"})
    Page<Professional> findAll(Specification<Professional> specification, Pageable pageable);

    @EntityGraph(attributePaths = {"department", "position", "contacts"})
    Optional<Professional> findDetailsById(Long id);

    @EntityGraph(attributePaths = {"department", "position"})
    Optional<Professional> findSummaryById(Long id);

    long countByStatus(ProfessionalStatus status);

    @Query("select new com.brayanfavarin.professionalmanagement.dto.dashboard.DepartmentProfessionalCountResponse(d.id, d.name, count(p)) "
            + "from Professional p join p.department d group by d.id, d.name order by d.name")
    List<DepartmentProfessionalCountResponse> countProfessionalsByDepartment();

    @Query("select new com.brayanfavarin.professionalmanagement.dto.dashboard.PositionProfessionalCountResponse(pos.id, pos.name, count(p)) "
            + "from Professional p join p.position pos group by pos.id, pos.name order by pos.name")
    List<PositionProfessionalCountResponse> countProfessionalsByPosition();

    @EntityGraph(attributePaths = {"department", "position"})
    List<Professional> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
