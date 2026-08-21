package com.brayanfavarin.professionalmanagement;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.nullValue;
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
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.security.test.context.support.WithMockUser;

import com.brayanfavarin.professionalmanagement.enums.ContactType;
import com.brayanfavarin.professionalmanagement.model.Contact;
import com.brayanfavarin.professionalmanagement.model.Professional;
import com.brayanfavarin.professionalmanagement.repository.ContactRepository;
import com.brayanfavarin.professionalmanagement.repository.DepartmentRepository;
import com.brayanfavarin.professionalmanagement.repository.PositionRepository;
import com.brayanfavarin.professionalmanagement.repository.ProfessionalRepository;

import jakarta.servlet.http.Cookie;

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
        mvc.perform(post("/api/professionals").with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.fields.name").exists());
    }

    @Test void preventsDuplicateDepartmentNames() throws Exception {
        String request = "{\"name\":\"Technology\",\"description\":\"Platform\"}";
        mvc.perform(post("/api/departments").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(request)).andExpect(status().isCreated());
        mvc.perform(post("/api/departments").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("DUPLICATE_DEPARTMENT"));
    }

    @Test void appliesProfessionalFiltersAndProtectsContactOwnership() throws Exception {
        Professional first = new Professional(); first.setName("Brayan"); first = professionals.save(first);
        Professional second = new Professional(); second.setName("Other"); second = professionals.save(second);
        Contact contact = new Contact(); contact.setProfessional(first); contact.setType(ContactType.EMAIL); contact.setValue("brayan@example.com"); contacts.save(contact);
        mvc.perform(get("/api/professionals").param("search", "bray").param("sort", "name,asc"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(1)).andExpect(jsonPath("$.content[0].name").value("Brayan"));
        mvc.perform(delete("/api/professionals/{professionalId}/contacts/{contactId}", second.getId(), contact.getId()).with(csrf()))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("CONTACT_NOT_FOUND"));
    }

    @Test void normalizesTextualInputAndKeepsBlankRequiredValuesInvalid() throws Exception {
        mvc.perform(post("/api/departments").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"  Technology  \",\"description\":\"  Platform team  \"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Technology"))
                .andExpect(jsonPath("$.description").value("Platform team"));

        mvc.perform(post("/api/positions").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"  Developer  \",\"description\":\"   \"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Developer"))
                .andExpect(jsonPath("$.description").value(nullValue()));

        mvc.perform(post("/api/departments").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"   \"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.fields.name").exists());

        mvc.perform(post("/api/professionals").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"  Ada Lovelace  \"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Ada Lovelace"));

        Professional professional = professionals.findAll().getFirst();
        mvc.perform(post("/api/professionals/{professionalId}/contacts", professional.getId()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"type\":\"EMAIL\",\"value\":\"  ada@example.test  \",\"label\":\"  Work  \"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.value").value("ada@example.test"))
                .andExpect(jsonPath("$.label").value("Work"));

        Contact contact = contacts.findAll().getFirst();
        mvc.perform(put("/api/professionals/{professionalId}/contacts/{contactId}", professional.getId(), contact.getId()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"type\":\"EMAIL\",\"value\":\" ada@example.test \",\"label\":\"   \"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.label").value(nullValue()));

        assertThat(contacts.findById(contact.getId())).hasValueSatisfying(saved -> {
            assertThat(saved.getValue()).isEqualTo("ada@example.test");
            assertThat(saved.getLabel()).isNull();
        });
    }

    private static RequestPostProcessor csrf() {
        return request -> {
            request.setCookies(new Cookie("XSRF-TOKEN", "api-core-csrf-token"));
            request.addHeader("X-XSRF-TOKEN", "api-core-csrf-token");
            return request;
        };
    }
}
