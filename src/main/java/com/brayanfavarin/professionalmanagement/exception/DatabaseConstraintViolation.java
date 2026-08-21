package com.brayanfavarin.professionalmanagement.exception;

import java.sql.SQLException;
import java.util.Optional;

import org.hibernate.exception.ConstraintViolationException;

public final class DatabaseConstraintViolation {

    public static final String DEPARTMENT_NAME_UNIQUE = "departments_name_key";
    public static final String POSITION_NAME_UNIQUE = "positions_name_key";
    public static final String PROFESSIONAL_DEPARTMENT_FOREIGN_KEY = "fk_professionals_department";
    public static final String PROFESSIONAL_POSITION_FOREIGN_KEY = "fk_professionals_position";

    private static final String UNIQUE_VIOLATION = "23505";
    private static final String FOREIGN_KEY_VIOLATION = "23503";

    private DatabaseConstraintViolation() {
    }

    public static boolean isUniqueViolation(Throwable failure) {
        return hasSqlState(failure, UNIQUE_VIOLATION);
    }

    public static boolean isForeignKeyViolation(Throwable failure, String constraintName) {
        return hasSqlState(failure, FOREIGN_KEY_VIOLATION)
                && constraintName(failure).filter(constraintName::equals).isPresent();
    }

    public static Optional<String> constraintName(Throwable failure) {
        for (Throwable current = failure; current != null; current = current.getCause()) {
            if (current instanceof ConstraintViolationException constraintViolation) {
                return Optional.ofNullable(constraintViolation.getConstraintName());
            }
        }
        return Optional.empty();
    }

    private static boolean hasSqlState(Throwable failure, String expectedSqlState) {
        for (Throwable current = failure; current != null; current = current.getCause()) {
            if (current instanceof SQLException sqlException && expectedSqlState.equals(sqlException.getSQLState())) {
                return true;
            }
        }
        return false;
    }
}
