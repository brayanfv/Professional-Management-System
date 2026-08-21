package com.brayanfavarin.professionalmanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;

@Configuration
public class OpenApiConfig {

    public static final String SESSION_COOKIE_AUTH = "sessionCookie";

    private final String sessionCookieName;

    public OpenApiConfig(@Value("${app.session.cookie-name}") String sessionCookieName) {
        this.sessionCookieName = sessionCookieName;
    }

    @Bean
    OpenAPI professionalManagementOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Professional Management System API")
                        .description("REST API for managing professionals, contacts, departments, positions, "
                                + "authentication and dashboard metrics.")
                        .version("1.0.0"))
                .components(new Components().addSecuritySchemes(SESSION_COOKIE_AUTH,
                        new SecurityScheme().type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.COOKIE)
                                .name(sessionCookieName)
                                .description("HttpOnly browser session cookie")))
                .addTagsItem(new Tag().name("Authentication").description("Authentication and current session"))
                .addTagsItem(new Tag().name("Professionals").description("Professional management"))
                .addTagsItem(new Tag().name("Contacts").description("Contacts belonging to a professional"))
                .addTagsItem(new Tag().name("Departments").description("Department management"))
                .addTagsItem(new Tag().name("Positions").description("Position management"))
                .addTagsItem(new Tag().name("Dashboard").description("Administrative dashboard metrics"));
    }
}
