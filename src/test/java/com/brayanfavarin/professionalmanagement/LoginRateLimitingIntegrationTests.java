package com.brayanfavarin.professionalmanagement;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import com.brayanfavarin.professionalmanagement.enums.UserRole;
import com.brayanfavarin.professionalmanagement.model.User;
import com.brayanfavarin.professionalmanagement.repository.UserRepository;

@SpringBootTest(properties = {
        "app.security.login-rate-limit.capacity=2",
        "app.security.login-rate-limit.refill-tokens=2",
        "app.security.login-rate-limit.refill-period=1h",
        "app.security.trusted-proxy.enabled=true",
        "app.security.trusted-proxy.addresses=172.30.0.2"
})
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LoginRateLimitingIntegrationTests {

    @Autowired
    MockMvc mvc;

    @Autowired
    UserRepository users;

    @Autowired
    PasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        users.deleteAll();
        User administrator = new User();
        administrator.setName("Administrator");
        administrator.setEmail("admin@example.com");
        administrator.setPassword(passwordEncoder.encode("password"));
        administrator.setRole(UserRole.ADMIN);
        administrator.setActive(true);
        users.save(administrator);
    }

    @Test
    void allowsAttemptsWithinTheBucketAndReturnsAStandard429AfterExhaustion() throws Exception {
        String clientAddress = "203.0.113.10";

        invalidLogin(clientAddress).andExpect(status().isUnauthorized());
        invalidLogin(clientAddress).andExpect(status().isUnauthorized());
        invalidLogin(clientAddress)
                .andExpect(status().isTooManyRequests())
                .andExpect(header().exists("Retry-After"))
                .andExpect(jsonPath("$.status").value(429))
                .andExpect(jsonPath("$.code").value("TOO_MANY_LOGIN_ATTEMPTS"))
                .andExpect(jsonPath("$.message").value("Too many sign-in attempts. Try again later."))
                .andExpect(jsonPath("$.path").value("/api/auth/login"));
    }

    @Test
    void permitsAValidLoginFromAnAllowedClient() throws Exception {
        mvc.perform(post("/api/auth/login")
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .with(remoteAddress("203.0.113.11"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@example.com\",\"password\":\"password\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void doesNotApplyTheLoginLimitToOtherEndpoints() throws Exception {
        mvc.perform(get("/actuator/health").with(remoteAddress("203.0.113.10")))
                .andExpect(status().isOk());
    }

    @Test
    void ignoresSpoofedForwardedAddressesFromAnUntrustedDirectCaller() throws Exception {
        String directAddress = "198.51.100.20";

        invalidLogin(directAddress, "203.0.113.10").andExpect(status().isUnauthorized());
        invalidLogin(directAddress, "203.0.113.11").andExpect(status().isUnauthorized());
        invalidLogin(directAddress, "203.0.113.12").andExpect(status().isTooManyRequests());
    }

    @Test
    void usesTheForwardedAddressOnlyWhenTheDirectCallerIsTheTrustedProxy() throws Exception {
        String trustedProxyAddress = "172.30.0.2";

        invalidLogin(trustedProxyAddress, "203.0.113.30").andExpect(status().isUnauthorized());
        invalidLogin(trustedProxyAddress, "203.0.113.30").andExpect(status().isUnauthorized());
        invalidLogin(trustedProxyAddress, "203.0.113.31").andExpect(status().isUnauthorized());
    }

    private org.springframework.test.web.servlet.ResultActions invalidLogin(String clientAddress) throws Exception {
        return mvc.perform(post("/api/auth/login")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .with(remoteAddress(clientAddress))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"admin@example.com\",\"password\":\"invalid\"}"));
    }

    private org.springframework.test.web.servlet.ResultActions invalidLogin(String clientAddress, String forwardedAddress)
            throws Exception {
        return mvc.perform(post("/api/auth/login")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .with(remoteAddress(clientAddress))
                .header("X-Forwarded-For", forwardedAddress)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"admin@example.com\",\"password\":\"invalid\"}"));
    }

    private static RequestPostProcessor remoteAddress(String address) {
        return request -> {
            request.setRemoteAddr(address);
            return request;
        };
    }
}
