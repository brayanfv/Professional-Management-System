package com.brayanfavarin.professionalmanagement.dto.contact;

import java.time.OffsetDateTime;

import com.brayanfavarin.professionalmanagement.enums.ContactType;

public record ContactResponse(Long id, ContactType type, String value, String label, OffsetDateTime createdAt,
        OffsetDateTime updatedAt) {
}
