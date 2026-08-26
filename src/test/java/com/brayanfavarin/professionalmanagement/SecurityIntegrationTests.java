package com.brayanfavarin.professionalmanagement;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import com.brayanfavarin.professionalmanagement.enums.UserRole;
import com.brayanfavarin.professionalmanagement.model.User;
import com.brayanfavarin.professionalmanagement.repository.UserRepository;

import jakarta.servlet.http.Cookie;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityIntegrationTests {

    private static final String CSRF_TOKEN = "test-csrf-token";
    private static final String CSRF_COOKIE_NAME = "XSRF-TOKEN";
    private static final String SESSION_COOKIE_NAME = "pm_session";

    @Autowired
    MockMvc mvc;

    @Autowired
    UserRepository users;

    @Autowired
    PasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        users.deleteAll();
        createUser("admin@example.com", "password", true);
    }

    @Test
    void authenticatesValidCredentialsWithAnHttpOnlySessionCookie() throws Exception {
        MvcResult result = login();

        String setCookie = result.getResponse().getHeader(HttpHeaders.SET_COOKIE);
        assertThat(setCookie)
                .contains(SESSION_COOKIE_NAME + "=", "HttpOnly", "Path=/", "SameSite=Lax", "Max-Age=3600")
                .doesNotContain("Secure");
        assertThat(result.getResponse().getCookie(SESSION_COOKIE_NAME)).isNotNull();
    }

    @Test
    void loginResponseDoesNotExposeTheJwtToJavaScript() throws Exception {
        mvc.perform(loginRequest())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").doesNotExist())
                .andExpect(jsonPath("$.tokenType").doesNotExist())
                .andExpect(jsonPath("$.expiresIn").doesNotExist())
                .andExpect(jsonPath("$.user.email").value("admin@example.com"))
                .andExpect(jsonPath("$.user.password").doesNotExist());
    }

    @Test
    void restoresTheAuthenticatedUserAndProtectsResourcesFromTheSessionCookie() throws Exception {
        Cookie sessionCookie = sessionCookie(login());

        mvc.perform(get("/api/auth/me").cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("admin@example.com"))
                .andExpect(jsonPath("$.role").value("ADMIN"));
        mvc.perform(get("/api/professionals").cookie(sessionCookie))
                .andExpect(status().isOk());
    }

    @Test
    void rejectsMissingInvalidAndLegacyBearerCredentials() throws Exception {
        mvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
        mvc.perform(get("/api/auth/me").cookie(new Cookie(SESSION_COOKIE_NAME, "not-a-token")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
        mvc.perform(get("/api/auth/me").header(HttpHeaders.AUTHORIZATION, "Bearer legacy-token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    void rejectsInvalidPasswordWithStandardError() throws Exception {
        mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@example.com\",\"password\":\"invalid\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
    }

    @Test
    void rejectsInactiveUsers() throws Exception {
        users.deleteAll();
        createUser("inactive@example.com", "password", false);

        mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"inactive@example.com\",\"password\":\"password\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
    }

    @Test
    void requiresCsrfForStateChangingRequestsAndPublishesAnXsrfCookie() throws Exception {
        MvcResult bootstrap = mvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andReturn();
        String csrfCookie = bootstrap.getResponse().getHeader(HttpHeaders.SET_COOKIE);
        assertThat(csrfCookie).contains(CSRF_COOKIE_NAME + "=").doesNotContain("HttpOnly");

        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@example.com\",\"password\":\"password\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("FORBIDDEN"));

        mvc.perform(loginRequest())
                .andExpect(status().isOk());
    }

    @Test
    void publishesAValidCsrfTokenAfterAuthenticationForSubsequentMutationsAndLogout() throws Exception {
        MvcResult bootstrap = mvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andReturn();
        Cookie initialCsrfCookie = csrfCookie(bootstrap);

        MvcResult login = mvc.perform(loginRequest(initialCsrfCookie))
                .andExpect(status().isOk())
                .andReturn();
        Cookie sessionCookie = sessionCookie(login);

        MvcResult authenticatedUser = mvc.perform(get("/api/auth/me")
                        .cookie(sessionCookie, initialCsrfCookie))
                .andExpect(status().isOk())
                .andReturn();
        Cookie refreshedCsrfCookie = csrfCookie(authenticatedUser);

        mvc.perform(post("/api/departments")
                        .cookie(sessionCookie, refreshedCsrfCookie)
                        .header("X-XSRF-TOKEN", refreshedCsrfCookie.getValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"CSRF Integration Department\",\"description\":\"Created after authentication\"}"))
                .andExpect(status().isCreated());

        MvcResult logout = mvc.perform(post("/api/auth/logout")
                        .cookie(sessionCookie, refreshedCsrfCookie)
                        .header("X-XSRF-TOKEN", refreshedCsrfCookie.getValue()))
                .andExpect(status().isNoContent())
                .andReturn();

        assertThat(logout.getResponse().getHeaders(HttpHeaders.SET_COOKIE))
                .anySatisfy(setCookie -> assertThat(setCookie)
                        .contains(SESSION_COOKIE_NAME + "=", "Max-Age=0", "HttpOnly", "Path=/", "SameSite=Lax")
                        .doesNotContain("Secure"));
        mvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void logoutExpiresTheCookieAndDoesNotRequireAnExistingAuthentication() throws Exception {
        Cookie sessionCookie = sessionCookie(login());

        MvcResult logout = mvc.perform(post("/api/auth/logout").cookie(sessionCookie).with(csrf()))
                .andExpect(status().isNoContent())
                .andReturn();

        assertThat(logout.getResponse().getHeaders(HttpHeaders.SET_COOKIE))
                .anySatisfy(setCookie -> assertThat(setCookie)
                        .contains(SESSION_COOKIE_NAME + "=", "Max-Age=0", "HttpOnly", "Path=/", "SameSite=Lax")
                        .doesNotContain("Secure"));
        mvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void permitsConfiguredCorsOriginWithCredentialsAndRejectsUnknownOrigins() throws Exception {
        mvc.perform(options("/api/auth/me")
                        .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));

        mvc.perform(options("/api/auth/me")
                        .header(HttpHeaders.ORIGIN, "https://untrusted.example")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isForbidden());
    }

    @Test
    void corsPreflightDoesNotRotateTheCsrfCookie() throws Exception {
        mvc.perform(options("/api/auth/logout")
                        .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                        .cookie(new Cookie(CSRF_COOKIE_NAME, CSRF_TOKEN)))
                .andExpect(status().isOk())
                .andExpect(header().doesNotExist(HttpHeaders.SET_COOKIE));
    }

    @Test
    void protectsAdministrativeEndpointsAndUsesStandardUnauthorizedResponse() throws Exception {
        mvc.perform(get("/api/professionals"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    void exposesOnlyUnauthenticatedHealthProbesWithoutInternalDetails() throws Exception {
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
    @WithMockUser(roles = "VIEWER")
    void returnsStandardForbiddenResponseForInsufficientRole() throws Exception {
        mvc.perform(get("/api/professionals"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("FORBIDDEN"));
    }

    private MvcResult login() throws Exception {
        return mvc.perform(loginRequest())
                .andExpect(status().isOk())
                .andReturn();
    }

    private static MockHttpServletRequestBuilder loginRequest() {
        return post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"admin@example.com\",\"password\":\"password\"}");
    }

    private static MockHttpServletRequestBuilder loginRequest(Cookie csrfCookie) {
        return post("/api/auth/login")
                .with(csrf(csrfCookie))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"admin@example.com\",\"password\":\"password\"}");
    }

    private static Cookie sessionCookie(MvcResult login) {
        Cookie cookie = login.getResponse().getCookie(SESSION_COOKIE_NAME);
        assertThat(cookie).isNotNull();
        return cookie;
    }

    private static RequestPostProcessor csrf() {
        return csrf(new Cookie(CSRF_COOKIE_NAME, CSRF_TOKEN));
    }

    private static RequestPostProcessor csrf(Cookie csrfCookie) {
        return request -> {
            Cookie[] existingCookies = request.getCookies();
            if (existingCookies == null) {
                request.setCookies(csrfCookie);
            } else {
                Cookie[] cookies = Arrays.copyOf(existingCookies, existingCookies.length + 1);
                cookies[cookies.length - 1] = csrfCookie;
                request.setCookies(cookies);
            }
            request.addHeader("X-XSRF-TOKEN", csrfCookie.getValue());
            return request;
        };
    }

    private static Cookie csrfCookie(MvcResult result) {
        String setCookie = result.getResponse().getHeaders(HttpHeaders.SET_COOKIE).stream()
                .filter(header -> header.startsWith(CSRF_COOKIE_NAME + "="))
                .filter(header -> !header.contains("Max-Age=0"))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Expected a current CSRF cookie"));
        String token = setCookie.substring((CSRF_COOKIE_NAME + "=").length(), setCookie.indexOf(';'));
        return new Cookie(CSRF_COOKIE_NAME, token);
    }

    private void createUser(String email, String password, boolean active) {
        User user = new User();
        user.setName("Administrator");
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(UserRole.ADMIN);
        user.setActive(active);
        users.save(user);
    }
}
