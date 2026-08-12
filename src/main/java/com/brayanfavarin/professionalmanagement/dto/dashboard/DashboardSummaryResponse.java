package com.brayanfavarin.professionalmanagement.dto.dashboard;

public record DashboardSummaryResponse(long totalProfessionals, long activeProfessionals,
        long inactiveProfessionals, long totalDepartments, long totalPositions) {
}
