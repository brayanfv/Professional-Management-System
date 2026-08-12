package com.brayanfavarin.professionalmanagement.mapper;

import com.brayanfavarin.professionalmanagement.dto.contact.ContactResponse;
import com.brayanfavarin.professionalmanagement.model.Contact;

public final class ContactMapper {
    private ContactMapper() { }
    public static ContactResponse toResponse(Contact contact) {
        return new ContactResponse(contact.getId(), contact.getType(), contact.getValue(), contact.getLabel(),
                contact.getCreatedAt(), contact.getUpdatedAt());
    }
}
