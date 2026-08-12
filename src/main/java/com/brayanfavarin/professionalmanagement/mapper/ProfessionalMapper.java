package com.brayanfavarin.professionalmanagement.mapper;

import com.brayanfavarin.professionalmanagement.dto.common.IdNameResponse;
import com.brayanfavarin.professionalmanagement.dto.professional.ProfessionalDetailsResponse;
import com.brayanfavarin.professionalmanagement.dto.professional.ProfessionalResponse;
import com.brayanfavarin.professionalmanagement.dto.professional.ProfessionalSummaryResponse;
import com.brayanfavarin.professionalmanagement.model.Professional;

public final class ProfessionalMapper {
    private ProfessionalMapper() { }
    public static ProfessionalResponse toResponse(Professional entity) {
        return new ProfessionalResponse(entity.getId(), entity.getName(), entity.getBirthDate(), entity.getStatus(), department(entity), position(entity), entity.getCreatedAt(), entity.getUpdatedAt());
    }
    public static ProfessionalSummaryResponse toSummary(Professional entity) {
        return new ProfessionalSummaryResponse(entity.getId(), entity.getName(), entity.getBirthDate(), entity.getStatus(), department(entity), position(entity), entity.getCreatedAt(), entity.getUpdatedAt());
    }
    public static ProfessionalDetailsResponse toDetails(Professional entity) {
        return new ProfessionalDetailsResponse(entity.getId(), entity.getName(), entity.getBirthDate(), entity.getStatus(), department(entity), position(entity), entity.getContacts().stream().map(ContactMapper::toResponse).toList(), entity.getCreatedAt(), entity.getUpdatedAt());
    }
    private static IdNameResponse department(Professional entity) {
        return entity.getDepartment() == null ? null : new IdNameResponse(entity.getDepartment().getId(), entity.getDepartment().getName());
    }
    private static IdNameResponse position(Professional entity) {
        return entity.getPosition() == null ? null : new IdNameResponse(entity.getPosition().getId(), entity.getPosition().getName());
    }
}
