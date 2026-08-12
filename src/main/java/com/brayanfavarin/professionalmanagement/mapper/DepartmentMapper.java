package com.brayanfavarin.professionalmanagement.mapper;

import com.brayanfavarin.professionalmanagement.dto.department.DepartmentResponse;
import com.brayanfavarin.professionalmanagement.model.Department;

public final class DepartmentMapper {
    private DepartmentMapper() { }
    public static DepartmentResponse toResponse(Department entity) {
        return new DepartmentResponse(entity.getId(), entity.getName(), entity.getDescription(), entity.getCreatedAt(), entity.getUpdatedAt());
    }
}
