package com.brayanfavarin.professionalmanagement;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.brayanfavarin.professionalmanagement.enums.ProfessionalStatus;
import com.brayanfavarin.professionalmanagement.model.Contact;
import com.brayanfavarin.professionalmanagement.model.Department;
import com.brayanfavarin.professionalmanagement.model.Position;
import com.brayanfavarin.professionalmanagement.model.Professional;
import com.brayanfavarin.professionalmanagement.repository.ContactRepository;
import com.brayanfavarin.professionalmanagement.repository.DepartmentRepository;
import com.brayanfavarin.professionalmanagement.repository.PositionRepository;
import com.brayanfavarin.professionalmanagement.repository.ProfessionalRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(roles = "ADMIN")
class DashboardIntegrationTests {

    @Autowired
    MockMvc mvc;

    @Autowired
    ContactRepository contacts;

    @Autowired
    ProfessionalRepository professionals;

    @Autowired
    DepartmentRepository departments;

    @Autowired
    PositionRepository positions;

    @BeforeEach
    void clean() {
        contacts.deleteAll();
        professionals.deleteAll();
        departments.deleteAll();
        positions.deleteAll();
    }

    @Test
    void returnsSummaryWithRepositoryCounts() throws Exception {
        Department technology = department("Technology");
        Position developer = position("Developer");
        professional("Active", ProfessionalStatus.ACTIVE, technology, developer, OffsetDateTime.now(ZoneOffset.UTC));
        professional("Inactive", ProfessionalStatus.INACTIVE, null, null, OffsetDateTime.now(ZoneOffset.UTC));

        mvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalProfessionals").value(2))
                .andExpect(jsonPath("$.activeProfessionals").value(1))
                .andExpect(jsonPath("$.inactiveProfessionals").value(1))
                .andExpect(jsonPath("$.totalDepartments").value(1))
                .andExpect(jsonPath("$.totalPositions").value(1));
    }

    @Test
    void aggregatesProfessionalsByDepartmentAndPositionWithoutUnassignedCategories() throws Exception {
        Department technology = department("Technology");
        Department finance = department("Finance");
        Position developer = position("Developer");
        Position analyst = position("Analyst");
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        professional("One", ProfessionalStatus.ACTIVE, technology, developer, now);
        professional("Two", ProfessionalStatus.ACTIVE, technology, developer, now);
        professional("Three", ProfessionalStatus.INACTIVE, finance, analyst, now);
        professional("Unassigned", ProfessionalStatus.ACTIVE, null, null, now);

        mvc.perform(get("/api/dashboard/professionals-by-department"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].departmentName").value("Finance"))
                .andExpect(jsonPath("$[0].count").value(1))
                .andExpect(jsonPath("$[1].departmentName").value("Technology"))
                .andExpect(jsonPath("$[1].count").value(2));

        mvc.perform(get("/api/dashboard/professionals-by-position"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].positionName").value("Analyst"))
                .andExpect(jsonPath("$[0].count").value(1))
                .andExpect(jsonPath("$[1].positionName").value("Developer"))
                .andExpect(jsonPath("$[1].count").value(2));
    }

    @Test
    void returnsMostRecentProfessionalsWithAssociatedNames() throws Exception {
        Department technology = department("Technology");
        Position developer = position("Developer");
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        professional("Older", ProfessionalStatus.ACTIVE, null, null, now.minusDays(1));
        professional("Newest", ProfessionalStatus.ACTIVE, technology, developer, now);

        mvc.perform(get("/api/dashboard/recent-professionals").param("limit", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Newest"))
                .andExpect(jsonPath("$[0].department.name").value("Technology"))
                .andExpect(jsonPath("$[0].position.name").value("Developer"));
    }

    @Test
    void rejectsInvalidRecentProfessionalsLimit() throws Exception {
        mvc.perform(get("/api/dashboard/recent-professionals").param("limit", "0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }

    @Test
    @WithAnonymousUser
    void requiresAuthenticationForDashboard() throws Exception {
        mvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    private Department department(String name) {
        Department department = new Department();
        department.setName(name);
        return departments.save(department);
    }

    private Position position(String name) {
        Position position = new Position();
        position.setName(name);
        return positions.save(position);
    }

    private Professional professional(String name, ProfessionalStatus status, Department department, Position position,
            OffsetDateTime createdAt) {
        Professional professional = new Professional();
        professional.setName(name);
        professional.setStatus(status);
        professional.setDepartment(department);
        professional.setPosition(position);
        professional.setCreatedAt(createdAt);
        return professionals.save(professional);
    }
}
