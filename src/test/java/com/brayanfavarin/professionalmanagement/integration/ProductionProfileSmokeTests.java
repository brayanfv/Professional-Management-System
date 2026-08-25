package com.brayanfavarin.professionalmanagement.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = Replace.NONE)
@ActiveProfiles("prod")
@Testcontainers
class ProductionProfileSmokeTests {

    @Container
    static final PostgreSQLContainer<?> POSTGRESQL = new PostgreSQLContainer<>(DockerImageName.parse("postgres:16-alpine"))
            .withDatabaseName("professional_management_prod_smoke")
            .withUsername("prod_smoke")
            .withPassword("prod_smoke");

    @DynamicPropertySource
    static void productionProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRESQL::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRESQL::getUsername);
        registry.add("spring.datasource.password", POSTGRESQL::getPassword);
        registry.add("DB_HOST", () -> "unused-by-prod-smoke");
        registry.add("DB_PORT", () -> "5432");
        registry.add("DB_NAME", () -> "professional_management_prod_smoke");
        registry.add("DB_USERNAME", POSTGRESQL::getUsername);
        registry.add("DB_PASSWORD", POSTGRESQL::getPassword);
        registry.add("JWT_SECRET", () -> "production-smoke-jwt-secret-with-at-least-32-characters");
        registry.add("CORS_ALLOWED_ORIGINS", () -> "https://app.example.test");
        registry.add("ADMIN_NAME", () -> "Production Smoke Administrator");
        registry.add("ADMIN_EMAIL", () -> "prod-smoke-admin@example.test");
        registry.add("ADMIN_PASSWORD", () -> "Prod-smoke-only-ChangeMe1!");
    }

    @Autowired
    MockMvc mvc;

    @Autowired
    Environment environment;

    @Autowired
    Flyway flyway;

    @Autowired
    ConfigurableApplicationContext applicationContext;

    @Test
    void startsTheProductionProfileAgainstPostgresWithFlywayAndHibernateValidation() {
        assertThat(POSTGRESQL.isRunning()).isTrue();
        assertThat(POSTGRESQL.getDockerImageName()).isEqualTo("postgres:16-alpine");
        assertThat(applicationContext.isRunning()).isTrue();
        assertThat(environment.getActiveProfiles()).containsExactly("prod");
        assertThat(environment.getProperty("spring.flyway.enabled")).isEqualTo("true");
        assertThat(environment.getProperty("spring.jpa.hibernate.ddl-auto")).isEqualTo("validate");
        assertThat(environment.getProperty("spring.jpa.open-in-view")).isEqualTo("false");
        assertThat(environment.getProperty("logging.level.com.brayanfavarin.professionalmanagement")).isEqualTo("INFO");
        assertThat(flyway.info().pending()).isEmpty();
        assertThat(flyway.validateWithResult().validationSuccessful).isTrue();
    }

    @Test
    void exposesOnlyHealthProbesAndKeepsProductionHealthDetailsPrivate() throws Exception {
        mvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.components").doesNotExist());
        mvc.perform(get("/actuator/health/liveness"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
        mvc.perform(get("/actuator/health/readiness"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
        mvc.perform(get("/actuator/env"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void usesASecureSessionCookieAndKeepsSwaggerDisabledInProduction() throws Exception {
        MvcResult login = mvc.perform(post("/api/auth/login")
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"prod-smoke-admin@example.test\",\"password\":\"Prod-smoke-only-ChangeMe1!\"}"))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(login.getResponse().getHeaders(HttpHeaders.SET_COOKIE))
                .anySatisfy(cookie -> assertThat(cookie)
                        .contains("pm_session=", "HttpOnly", "Secure", "SameSite=Lax"));
        mvc.perform(get("/v3/api-docs"))
                .andExpect(status().isNotFound());
        mvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isNotFound());
    }
}
