package com.brayanfavarin.professionalmanagement.security;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Configuration for the single-instance login limiter. A distributed deployment
 * must replace this local state with a shared limiter before horizontal scaling.
 */
@Component
@Validated
@ConfigurationProperties(prefix = "app.security.login-rate-limit")
public class LoginRateLimitProperties {

    @Min(1)
    private long capacity = 10;

    @Min(1)
    private long refillTokens = 10;

    @NotNull
    private Duration refillPeriod = Duration.ofMinutes(1);

    public long getCapacity() {
        return capacity;
    }

    public void setCapacity(long capacity) {
        this.capacity = capacity;
    }

    public long getRefillTokens() {
        return refillTokens;
    }

    public void setRefillTokens(long refillTokens) {
        this.refillTokens = refillTokens;
    }

    public Duration getRefillPeriod() {
        return refillPeriod;
    }

    public void setRefillPeriod(Duration refillPeriod) {
        this.refillPeriod = refillPeriod;
    }
}
