package com.brayanfavarin.professionalmanagement.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brayanfavarin.professionalmanagement.dto.common.IdNameResponse;
import com.brayanfavarin.professionalmanagement.dto.dashboard.DashboardSummaryResponse;
import com.brayanfavarin.professionalmanagement.dto.dashboard.DepartmentProfessionalCountResponse;
import com.brayanfavarin.professionalmanagement.dto.dashboard.PositionProfessionalCountResponse;
import com.brayanfavarin.professionalmanagement.dto.dashboard.RecentProfessionalResponse;
import com.brayanfavarin.professionalmanagement.enums.ProfessionalStatus;
import com.brayanfavarin.professionalmanagement.model.Professional;
import com.brayanfavarin.professionalmanagement.repository.DepartmentRepository;
import com.brayanfavarin.professionalmanagement.repository.PositionRepository;
import com.brayanfavarin.professionalmanagement.repository.ProfessionalRepository;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final ProfessionalRepository professionalRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;

    public DashboardService(ProfessionalRepository professionalRepository, DepartmentRepository departmentRepository,
            PositionRepository positionRepository) {
        this.professionalRepository = professionalRepository;
        this.departmentRepository = departmentRepository;
        this.positionRepository = positionRepository;
    }

    public DashboardSummaryResponse summary() {
        return new DashboardSummaryResponse(
                professionalRepository.count(),
                professionalRepository.countByStatus(ProfessionalStatus.ACTIVE),
                professionalRepository.countByStatus(ProfessionalStatus.INACTIVE),
                departmentRepository.count(),
                positionRepository.count());
    }

    public List<DepartmentProfessionalCountResponse> professionalsByDepartment() {
        return professionalRepository.countProfessionalsByDepartment();
    }

    public List<PositionProfessionalCountResponse> professionalsByPosition() {
        return professionalRepository.countProfessionalsByPosition();
    }

    public List<RecentProfessionalResponse> recentProfessionals(int limit) {
        PageRequest pageRequest = PageRequest.of(0, limit);
        return professionalRepository.findAllByOrderByCreatedAtDesc(pageRequest).stream()
                .map(this::toRecentResponse)
                .toList();
    }

    private RecentProfessionalResponse toRecentResponse(Professional professional) {
        IdNameResponse department = professional.getDepartment() == null ? null
                : new IdNameResponse(professional.getDepartment().getId(), professional.getDepartment().getName());
        IdNameResponse position = professional.getPosition() == null ? null
                : new IdNameResponse(professional.getPosition().getId(), professional.getPosition().getName());
        return new RecentProfessionalResponse(professional.getId(), professional.getName(), professional.getStatus(),
                department, position, professional.getCreatedAt());
    }
}
