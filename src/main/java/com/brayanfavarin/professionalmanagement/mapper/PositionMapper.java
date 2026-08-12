package com.brayanfavarin.professionalmanagement.mapper;

import com.brayanfavarin.professionalmanagement.dto.position.PositionResponse;
import com.brayanfavarin.professionalmanagement.model.Position;

public final class PositionMapper {
    private PositionMapper() { }
    public static PositionResponse toResponse(Position entity) {
        return new PositionResponse(entity.getId(), entity.getName(), entity.getDescription(), entity.getCreatedAt(), entity.getUpdatedAt());
    }
}
