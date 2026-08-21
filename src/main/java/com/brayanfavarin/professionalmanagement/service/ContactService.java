package com.brayanfavarin.professionalmanagement.service;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brayanfavarin.professionalmanagement.dto.contact.ContactResponse;
import com.brayanfavarin.professionalmanagement.dto.contact.CreateContactRequest;
import com.brayanfavarin.professionalmanagement.dto.contact.UpdateContactRequest;
import com.brayanfavarin.professionalmanagement.enums.ContactType;
import com.brayanfavarin.professionalmanagement.exception.ResourceNotFoundException;
import com.brayanfavarin.professionalmanagement.mapper.ContactMapper;
import com.brayanfavarin.professionalmanagement.model.Contact;
import com.brayanfavarin.professionalmanagement.model.Professional;
import com.brayanfavarin.professionalmanagement.repository.ContactRepository;
import com.brayanfavarin.professionalmanagement.repository.ProfessionalRepository;

@Service
public class ContactService {
    private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    private final ContactRepository contacts; private final ProfessionalRepository professionals;
    public ContactService(ContactRepository contacts, ProfessionalRepository professionals) { this.contacts = contacts; this.professionals = professionals; }
    @Transactional(readOnly = true)
    public List<ContactResponse> list(Long professionalId) { professional(professionalId); return contacts.findByProfessionalId(professionalId).stream().map(ContactMapper::toResponse).toList(); }
    @Transactional
    public ContactResponse create(Long professionalId, CreateContactRequest request) { Professional professional = professional(professionalId); String value = InputNormalizer.required(request.value()); validate(request.type(), value); Contact c = new Contact(); c.setProfessional(professional); c.setType(request.type()); c.setValue(value); c.setLabel(InputNormalizer.optional(request.label())); return ContactMapper.toResponse(contacts.save(c)); }
    @Transactional
    public ContactResponse update(Long professionalId, Long contactId, UpdateContactRequest request) { Contact c = owned(professionalId, contactId); String value = InputNormalizer.required(request.value()); validate(request.type(), value); c.setType(request.type()); c.setValue(value); c.setLabel(InputNormalizer.optional(request.label())); return ContactMapper.toResponse(c); }
    @Transactional
    public void delete(Long professionalId, Long contactId) { contacts.delete(owned(professionalId, contactId)); }
    private Professional professional(Long id) { return professionals.findById(id).orElseThrow(() -> new ResourceNotFoundException("PROFESSIONAL_NOT_FOUND", "Professional not found")); }
    private Contact owned(Long professionalId, Long contactId) { professional(professionalId); return contacts.findByIdAndProfessionalId(contactId, professionalId).orElseThrow(() -> new ResourceNotFoundException("CONTACT_NOT_FOUND", "Contact not found")); }
    private void validate(ContactType type, String value) { if (type == ContactType.EMAIL && !EMAIL.matcher(value).matches()) throw new IllegalArgumentException("Invalid email contact value"); }
}
