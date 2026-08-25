package com.brayanfavarin.professionalmanagement.security;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Resolves a login limiter key without trusting forwarded headers from direct
 * callers. A forwarded address is used only when the immediate peer is an
 * explicitly configured proxy and the header has exactly one literal IP value.
 */
@Component
public class ClientIpResolver {

    private static final String FORWARDED_FOR = "X-Forwarded-For";

    private final TrustedProxyProperties properties;
    private Set<InetAddress> trustedProxyAddresses = Set.of();

    public ClientIpResolver(TrustedProxyProperties properties) {
        this.properties = properties;
    }

    @PostConstruct
    void initializeTrustedAddresses() {
        if (!properties.isEnabled()) {
            return;
        }

        trustedProxyAddresses = properties.getAddresses().stream()
                .map(this::parseRequiredLiteralAddress)
                .collect(Collectors.toUnmodifiableSet());
    }

    public String resolve(HttpServletRequest request) {
        String directAddress = request.getRemoteAddr();
        InetAddress directLiteralAddress = parseLiteralAddress(directAddress);
        if (!properties.isEnabled() || directLiteralAddress == null
                || !trustedProxyAddresses.contains(directLiteralAddress)) {
            return directAddress;
        }

        String forwardedFor = request.getHeader(FORWARDED_FOR);
        if (forwardedFor == null || forwardedFor.isBlank() || forwardedFor.contains(",")) {
            return directAddress;
        }

        InetAddress forwardedAddress = parseLiteralAddress(forwardedFor.trim());
        return forwardedAddress == null ? directAddress : forwardedAddress.getHostAddress();
    }

    private InetAddress parseRequiredLiteralAddress(String value) {
        InetAddress address = parseLiteralAddress(value);
        if (address == null) {
            throw new IllegalStateException("Trusted proxy addresses must be literal IP addresses");
        }
        return address;
    }

    private InetAddress parseLiteralAddress(String value) {
        if (value == null || !value.matches("[0-9A-Fa-f:.]+")) {
            return null;
        }

        try {
            return InetAddress.getByName(value);
        } catch (UnknownHostException ex) {
            return null;
        }
    }
}
