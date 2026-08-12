package com.brayanfavarin.professionalmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.brayanfavarin.professionalmanagement.model.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByProfessionalId(Long professionalId);
    Optional<Contact> findByIdAndProfessionalId(Long id, Long professionalId);
}
