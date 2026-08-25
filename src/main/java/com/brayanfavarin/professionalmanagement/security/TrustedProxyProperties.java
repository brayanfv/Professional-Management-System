package com.brayanfavarin.professionalmanagement.security;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.AssertTrue;

/**
 * Explicit proxy peers allowed to supply a client address for the login limiter.
 * The backend must not be reachable from outside the trusted proxy network.
 */
@Component
@Validated
@ConfigurationProperties(prefix = "app.security.trusted-proxy")
public class TrustedProxyProperties {

    private boolean enabled;
    private List<String> addresses = new ArrayList<>();

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public List<String> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<String> addresses) {
        this.addresses = addresses == null ? new ArrayList<>() : new ArrayList<>(addresses);
    }

    @AssertTrue(message = "Trusted proxy addresses are required when trusted proxy support is enabled")
    public boolean hasAddressesWhenEnabled() {
        return !enabled || !addresses.isEmpty();
    }
}
