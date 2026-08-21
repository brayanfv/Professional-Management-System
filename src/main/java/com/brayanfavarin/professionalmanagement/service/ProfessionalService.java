package com.brayanfavarin.professionalmanagement.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Locale;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brayanfavarin.professionalmanagement.dto.common.PageResponse;
import com.brayanfavarin.professionalmanagement.dto.professional.CreateProfessionalRequest;
import com.brayanfavarin.professionalmanagement.dto.professional.ProfessionalDetailsResponse;
import com.brayanfavarin.professionalmanagement.dto.professional.ProfessionalResponse;
import com.brayanfavarin.professionalmanagement.dto.professional.ProfessionalSummaryResponse;
import com.brayanfavarin.professionalmanagement.dto.professional.UpdateProfessionalRequest;
import com.brayanfavarin.professionalmanagement.dto.professional.UpdateProfessionalStatusRequest;
import com.brayanfavarin.professionalmanagement.enums.ProfessionalStatus;
import com.brayanfavarin.professionalmanagement.exception.ResourceNotFoundException;
import com.brayanfavarin.professionalmanagement.mapper.ProfessionalMapper;
import com.brayanfavarin.professionalmanagement.model.Department;
import com.brayanfavarin.professionalmanagement.model.Position;
import com.brayanfavarin.professionalmanagement.model.Professional;
import com.brayanfavarin.professionalmanagement.repository.DepartmentRepository;
import com.brayanfavarin.professionalmanagement.repository.PositionRepository;
import com.brayanfavarin.professionalmanagement.repository.ProfessionalRepository;

@Service
public class ProfessionalService {
    private final ProfessionalRepository professionals;
    private final DepartmentRepository departments;
    private final PositionRepository positions;
    public ProfessionalService(ProfessionalRepository professionals, DepartmentRepository departments, PositionRepository positions) { this.professionals = professionals; this.departments = departments; this.positions = positions; }

    @Transactional
    public ProfessionalResponse create(CreateProfessionalRequest request) {
        Professional professional = new Professional();
        apply(professional, request.name(), request.birthDate(), request.departmentId(), request.positionId());
        return ProfessionalMapper.toResponse(professionals.save(professional));
    }

    @Transactional(readOnly = true)
    public PageResponse<ProfessionalSummaryResponse> list(String search, ProfessionalStatus status, Long departmentId, Long positionId, Pageable pageable) {
        Page<Professional> page = professionals.findAll(specification(search, status, departmentId, positionId), pageable);
        return PageResponse.from(page, ProfessionalMapper::toSummary);
    }

    @Transactional(readOnly = true)
    public ProfessionalDetailsResponse get(Long id) {
        return ProfessionalMapper.toDetails(details(id));
    }

    @Transactional
    public ProfessionalResponse update(Long id, UpdateProfessionalRequest request) {
        Professional professional = entity(id);
        apply(professional, request.name(), request.birthDate(), request.departmentId(), request.positionId());
        return ProfessionalMapper.toResponse(professional);
    }

    @Transactional
    public ProfessionalResponse updateStatus(Long id, UpdateProfessionalStatusRequest request) {
        Professional professional = summary(id);
        professional.setStatus(request.status());
        return ProfessionalMapper.toResponse(professional);
    }

    @Transactional
    public void delete(Long id) {
        professionals.delete(entity(id));
    }

    private Professional details(Long id) {
        return professionals.findDetailsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PROFESSIONAL_NOT_FOUND", "Professional not found"));
    }

    private Professional summary(Long id) {
        return professionals.findSummaryById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PROFESSIONAL_NOT_FOUND", "Professional not found"));
    }

    private Professional entity(Long id) {
        return professionals.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PROFESSIONAL_NOT_FOUND", "Professional not found"));
    }

    private void apply(Professional professional, String name, LocalDate birthDate, Long departmentId, Long positionId) {
        professional.setName(InputNormalizer.required(name));
        professional.setBirthDate(birthDate);
        professional.setDepartment(departmentId == null ? null : departments.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("DEPARTMENT_NOT_FOUND", "Department not found")));
        professional.setPosition(positionId == null ? null : positions.findById(positionId)
                .orElseThrow(() -> new ResourceNotFoundException("POSITION_NOT_FOUND", "Position not found")));
    }

    private Specification<Professional> specification(String search, ProfessionalStatus status, Long departmentId,
            Long positionId) {
        String normalizedSearch = normalizeSearch(search);

        return (root, query, criteriaBuilder) -> {
            var predicates = new ArrayList<Predicate>();
            if (normalizedSearch != null) {
                String pattern = "%" + escapeLikePattern(normalizedSearch) + "%";
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern, '\\'));
            }
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            if (departmentId != null) {
                predicates.add(criteriaBuilder.equal(root.get("department").get("id"), departmentId));
            }
            if (positionId != null) {
                predicates.add(criteriaBuilder.equal(root.get("position").get("id"), positionId));
            }
            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private String normalizeSearch(String search) {
        String normalized = InputNormalizer.optional(search);
        return normalized == null ? null : normalized.toLowerCase(Locale.ROOT);
    }

    private String escapeLikePattern(String value) {
        return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }
}
