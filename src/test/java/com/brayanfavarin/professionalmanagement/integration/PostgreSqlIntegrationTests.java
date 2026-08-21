package com.brayanfavarin.professionalmanagement.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;

import org.assertj.core.api.ThrowableAssert.ThrowingCallable;
import org.hibernate.Hibernate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpServletRequest;

import com.brayanfavarin.professionalmanagement.dto.common.PageResponse;
import com.brayanfavarin.professionalmanagement.dto.professional.ProfessionalSummaryResponse;
import com.brayanfavarin.professionalmanagement.enums.ContactType;
import com.brayanfavarin.professionalmanagement.enums.ProfessionalStatus;
import com.brayanfavarin.professionalmanagement.exception.GlobalExceptionHandler;
import com.brayanfavarin.professionalmanagement.model.Contact;
import com.brayanfavarin.professionalmanagement.model.Department;
import com.brayanfavarin.professionalmanagement.model.Position;
import com.brayanfavarin.professionalmanagement.model.Professional;
import com.brayanfavarin.professionalmanagement.repository.ContactRepository;
import com.brayanfavarin.professionalmanagement.repository.DepartmentRepository;
import com.brayanfavarin.professionalmanagement.repository.PositionRepository;
import com.brayanfavarin.professionalmanagement.repository.ProfessionalRepository;
import com.brayanfavarin.professionalmanagement.service.ProfessionalService;

import jakarta.persistence.EntityManager;

class PostgreSqlIntegrationTests extends PostgreSqlIntegrationTest {

    @Autowired
    private ConfigurableApplicationContext applicationContext;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private org.flywaydb.core.Flyway flyway;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private DepartmentRepository departments;

    @Autowired
    private PositionRepository positions;

    @Autowired
    private ProfessionalRepository professionals;

    @Autowired
    private ContactRepository contacts;

    @Autowired
    private GlobalExceptionHandler exceptionHandler;

    @Autowired
    private ProfessionalService professionalService;

    @Test
    void startsAgainstAnEmptyPostgresContainerWithValidatedFlywayMigrations() {
        Integer appliedMigrations = jdbcTemplate.queryForObject(
                "select count(*) from flyway_schema_history where success = true", Integer.class);

        assertThat(POSTGRESQL.isRunning()).isTrue();
        assertThat(POSTGRESQL.getDockerImageName()).isEqualTo("postgres:16-alpine");
        assertThat(applicationContext.isRunning()).isTrue();
        assertThat(flyway.info().current()).isNotNull();
        assertThat(flyway.info().pending()).isEmpty();
        assertThat(flyway.validateWithResult().validationSuccessful).isTrue();
        assertThat(appliedMigrations).isGreaterThan(0);
    }

    @Test
    void paginatesAndFiltersProfessionalsWithDepartmentAndPositionWithoutLoadingContacts() {
        Department technology = department("Technology");
        Position developer = position("Software Developer");

        Professional ada = professional("Ada Lovelace", ProfessionalStatus.ACTIVE, technology, developer);
        professional("Grace Hopper", ProfessionalStatus.ACTIVE, technology, developer);
        professional("Inactive Engineer", ProfessionalStatus.INACTIVE, technology, developer);

        Contact contact = new Contact();
        contact.setProfessional(ada);
        contact.setType(ContactType.EMAIL);
        contact.setValue("ada@example.test");
        contacts.save(contact);

        entityManager.flush();
        entityManager.clear();

        Specification<Professional> specification = (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.equal(root.get("status"), ProfessionalStatus.ACTIVE),
                criteriaBuilder.equal(root.get("department").get("id"), technology.getId()),
                criteriaBuilder.equal(root.get("position").get("id"), developer.getId()));

        Page<Professional> page = professionals.findAll(
                specification,
                PageRequest.of(0, 1, Sort.by(Sort.Direction.ASC, "name")));
        Professional loaded = page.getContent().getFirst();

        assertThat(page.getTotalElements()).isEqualTo(2);
        assertThat(page.getTotalPages()).isEqualTo(2);
        assertThat(loaded.getName()).isEqualTo("Ada Lovelace");
        assertThat(Hibernate.isInitialized(loaded.getDepartment())).isTrue();
        assertThat(Hibernate.isInitialized(loaded.getPosition())).isTrue();
        assertThat(Hibernate.isInitialized(loaded.getContacts())).isFalse();
        assertThat(loaded.getDepartment().getName()).isEqualTo("Technology");
        assertThat(loaded.getPosition().getName()).isEqualTo("Software Developer");
    }

    @Test
    void mapsPostgreSqlDepartmentUniquenessViolationsToThePublicConflictContract() {
        department("Technology");

        Department duplicate = new Department();
        duplicate.setName("Technology");

        DataIntegrityViolationException exception = dataIntegrityViolation(() -> departments.saveAndFlush(duplicate));

        var response = exceptionHandler.dataIntegrity(exception, request("POST", "/api/departments"));
        assertThat(response.getStatusCode().value()).isEqualTo(409);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().code()).isEqualTo("DUPLICATE_DEPARTMENT");
        assertThat(response.getBody().message()).doesNotContain("duplicate key").doesNotContain("departments_name_key");
    }

    @Test
    void mapsPostgreSqlPositionUniquenessViolationsToThePublicConflictContract() {
        position("Software Developer");

        Position duplicate = new Position();
        duplicate.setName("Software Developer");

        DataIntegrityViolationException exception = dataIntegrityViolation(() -> positions.saveAndFlush(duplicate));

        var response = exceptionHandler.dataIntegrity(exception, request("POST", "/api/positions"));
        assertThat(response.getStatusCode().value()).isEqualTo(409);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().code()).isEqualTo("DUPLICATE_POSITION");
        assertThat(response.getBody().message()).doesNotContain("duplicate key").doesNotContain("positions_name_key");
    }

    @Test
    void mapsPostgreSqlDepartmentForeignKeyViolationsToDepartmentInUse() {
        Department technology = department("Technology");
        professional("Ada Lovelace", ProfessionalStatus.ACTIVE, technology, null);
        entityManager.flush();
        entityManager.clear();

        DataIntegrityViolationException exception = dataIntegrityViolation(() -> {
            departments.deleteById(technology.getId());
            departments.flush();
        });

        var response = exceptionHandler.dataIntegrity(exception, request("DELETE", "/api/departments/" + technology.getId()));
        assertThat(response.getStatusCode().value()).isEqualTo(409);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().code()).isEqualTo("DEPARTMENT_IN_USE");
        assertThat(response.getBody().message()).doesNotContain("foreign key").doesNotContain("fk_professionals_department");
    }

    @Test
    void mapsPostgreSqlPositionForeignKeyViolationsToPositionInUse() {
        Position developer = position("Software Developer");
        professional("Ada Lovelace", ProfessionalStatus.ACTIVE, null, developer);
        entityManager.flush();
        entityManager.clear();

        DataIntegrityViolationException exception = dataIntegrityViolation(() -> {
            positions.deleteById(developer.getId());
            positions.flush();
        });

        var response = exceptionHandler.dataIntegrity(exception, request("DELETE", "/api/positions/" + developer.getId()));
        assertThat(response.getStatusCode().value()).isEqualTo(409);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().code()).isEqualTo("POSITION_IN_USE");
        assertThat(response.getBody().message()).doesNotContain("foreign key").doesNotContain("fk_professionals_position");
    }

    @Test
    void treatsLikeWildcardsAsLiteralCharactersInProfessionalSearches() {
        professional("Developer 100%", ProfessionalStatus.ACTIVE, null, null);
        professional("Developer 100 percent", ProfessionalStatus.ACTIVE, null, null);
        professional("John_Doe", ProfessionalStatus.ACTIVE, null, null);
        professional("JohnADoe", ProfessionalStatus.ACTIVE, null, null);

        PageResponse<ProfessionalSummaryResponse> percentResults = professionalService.list(
                " 100% ", null, null, null, PageRequest.of(0, 10, Sort.by("name")));
        PageResponse<ProfessionalSummaryResponse> underscoreResults = professionalService.list(
                "_", null, null, null, PageRequest.of(0, 10, Sort.by("name")));

        assertThat(percentResults.content()).extracting(ProfessionalSummaryResponse::name)
                .containsExactly("Developer 100%");
        assertThat(underscoreResults.content()).extracting(ProfessionalSummaryResponse::name)
                .containsExactly("John_Doe");
    }

    private MockHttpServletRequest request(String method, String path) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod(method);
        request.setRequestURI(path);
        return request;
    }

    private DataIntegrityViolationException dataIntegrityViolation(ThrowingCallable action) {
        Throwable failure = catchThrowable(action);
        assertThat(failure).isInstanceOf(DataIntegrityViolationException.class);
        return (DataIntegrityViolationException) failure;
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

    private Professional professional(
            String name,
            ProfessionalStatus status,
            Department department,
            Position position) {
        Professional professional = new Professional();
        professional.setName(name);
        professional.setStatus(status);
        professional.setDepartment(department);
        professional.setPosition(position);
        return professionals.save(professional);
    }
}
