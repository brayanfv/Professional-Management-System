package com.brayanfavarin.professionalmanagement.exception;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.brayanfavarin.professionalmanagement.dto.common.ApiErrorResponse;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import jakarta.servlet.http.HttpServletRequest;

class GlobalExceptionHandlerTests {

    @Test
    void logsUnexpectedExceptionAndKeepsResponseSafe() {
        Logger logger = (Logger) LoggerFactory.getLogger(GlobalExceptionHandler.class);
        ListAppender<ILoggingEvent> appender = new ListAppender<>();
        appender.start();
        logger.addAppender(appender);

        try {
            HttpServletRequest request = mock(HttpServletRequest.class);
            when(request.getMethod()).thenReturn("GET");
            when(request.getRequestURI()).thenReturn("/api/test-failure");
            RuntimeException failure = new RuntimeException("sensitive internal diagnostic");

            ResponseEntity<ApiErrorResponse> response =
                    new GlobalExceptionHandler().unexpected(failure, request);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().message())
                    .isEqualTo("An unexpected error occurred")
                    .doesNotContain(failure.getMessage());
            assertThat(appender.list).hasSize(1);
            ILoggingEvent event = appender.list.getFirst();
            assertThat(event.getFormattedMessage())
                    .isEqualTo("Unexpected exception while processing GET /api/test-failure");
            assertThat(event.getThrowableProxy()).isNotNull();
            assertThat(event.getThrowableProxy().getClassName())
                    .isEqualTo(RuntimeException.class.getName());
        } finally {
            logger.detachAppender(appender);
            appender.stop();
        }
    }
}
