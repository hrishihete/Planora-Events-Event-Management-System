package com.planora.api.error;

import com.planora.api.event.EventNotFoundException;
import com.planora.api.event.IllegalEventStateException;
import com.planora.api.identity.DuplicateEmailException;
import com.planora.api.identity.ForbiddenException;
import com.planora.api.identity.UnauthorizedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(EventNotFoundException.class)
    ProblemDetail notFound(EventNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Event not found");
        problem.setType(URI.create("https://planora.local/problems/not-found"));
        return problem;
    }

    @ExceptionHandler(DuplicateEmailException.class)
    ProblemDetail conflict(DuplicateEmailException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setTitle("Email already registered");
        problem.setType(URI.create("https://planora.local/problems/conflict"));
        return problem;
    }

    @ExceptionHandler(IllegalEventStateException.class)
    ProblemDetail illegalState(IllegalEventStateException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setTitle("Illegal event state");
        problem.setType(URI.create("https://planora.local/problems/conflict"));
        return problem;
    }

    @ExceptionHandler({ForbiddenException.class, AccessDeniedException.class})
    ProblemDetail forbidden(RuntimeException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, ex.getMessage());
        problem.setTitle("Forbidden");
        problem.setType(URI.create("https://planora.local/problems/forbidden"));
        return problem;
    }

    @ExceptionHandler({UnauthorizedException.class, AuthenticationException.class})
    ProblemDetail unauthorized(RuntimeException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, "Authentication required");
        problem.setTitle("Unauthorized");
        problem.setType(URI.create("https://planora.local/problems/unauthorized"));
        return problem;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail validation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Request validation failed"
        );
        problem.setTitle("Validation failed");
        problem.setType(URI.create("https://planora.local/problems/validation"));
        problem.setProperty("errors", errors);
        return problem;
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    ProblemDetail badRequest(Exception ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Malformed request"
        );
        problem.setTitle("Bad request");
        problem.setType(URI.create("https://planora.local/problems/bad-request"));
        return problem;
    }
}
