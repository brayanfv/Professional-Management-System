package com.brayanfavarin.professionalmanagement.security;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Component;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.annotation.PostConstruct;

/**
 * In-memory, per-direct-client-IP limiter for POST /api/auth/login.
 *
 * <p>It deliberately does not trust forwarded headers before a trusted proxy
 * topology has been configured. Its state is local to this JVM and is therefore
 * appropriate only for the current single-instance deployment target.</p>
 */
@Component
public class LoginRateLimiter {

    private final LoginRateLimitProperties properties;
    private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    public LoginRateLimiter(LoginRateLimitProperties properties) {
        this.properties = properties;
    }

    @PostConstruct
    void validateConfiguration() {
        Duration refillPeriod = properties.getRefillPeriod();
        if (refillPeriod.isZero() || refillPeriod.isNegative()) {
            throw new IllegalStateException("Login rate limit refill period must be positive");
        }
    }

    public LoginRateLimitResult tryConsume(String clientAddress) {
        Bucket bucket = buckets.computeIfAbsent(clientAddress, ignored -> newBucket());
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        return new LoginRateLimitResult(probe.isConsumed(), probe.getNanosToWaitForRefill());
    }

    private Bucket newBucket() {
        return Bucket.builder()
                .addLimit(limit -> limit
                        .capacity(properties.getCapacity())
                        .refillGreedy(properties.getRefillTokens(), properties.getRefillPeriod()))
                .build();
    }

    public record LoginRateLimitResult(boolean allowed, long nanosToWaitForRefill) {
    }
}
