package com.brayanfavarin.professionalmanagement;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import com.brayanfavarin.professionalmanagement.enums.ContactType;
import com.brayanfavarin.professionalmanagement.model.Contact;
import com.brayanfavarin.professionalmanagement.model.Professional;
import com.brayanfavarin.professionalmanagement.repository.ContactRepository;
import com.brayanfavarin.professionalmanagement.repository.DepartmentRepository;
import com.brayanfavarin.professionalmanagement.repository.PositionRepository;
import com.brayanfavarin.professionalmanagement.repository.ProfessionalRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(roles = "ADMIN")
class ApiCoreIntegrationTests {
    @Autowired MockMvc mvc;
    @Autowired ContactRepository contacts;
    @Autowired ProfessionalRepository professionals;
    @Autowired DepartmentRepository departments;
    @Autowired PositionRepository positions;

    @BeforeEach void clean() { contacts.deleteAll(); professionals.deleteAll(); departments.deleteAll(); positions.deleteAll(); }

    @Test void returnsValidationErrorContract() throws Exception {
        mvc.perform(post("/api/professionals").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.fields.name").exists());
    }

    @Test void preventsDuplicateDepartmentNames() throws Exception {
        String request = "{\"name\":\"Technology\",\"description\":\"Platform\"}";
        mvc.perform(post("/api/departments").contentType(MediaType.APPLICATION_JSON).content(request)).andExpect(status().isCreated());
        mvc.perform(post("/api/departments").contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("DUPLICATE_DEPARTMENT"));
    }

    @Test void appliesProfessionalFiltersAndProtectsContactOwnership() throws Exception {
        Professional first = new Professional(); first.setName("Brayan"); first = professionals.save(first);
        Professional second = new Professional(); second.setName("Other"); second = professionals.save(second);
        Contact contact = new Contact(); contact.setProfessional(first); contact.setType(ContactType.EMAIL); contact.setValue("brayan@example.com"); contacts.save(contact);
        mvc.perform(get("/api/professionals").param("search", "bray").param("sort", "name,asc"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(1)).andExpect(jsonPath("$.content[0].name").value("Brayan"));
        mvc.perform(delete("/api/professionals/{professionalId}/contacts/{contactId}", second.getId(), contact.getId()))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("CONTACT_NOT_FOUND"));
    }
}
