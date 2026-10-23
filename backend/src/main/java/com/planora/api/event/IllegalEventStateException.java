package com.planora.api.event;

public class IllegalEventStateException extends RuntimeException {
    public IllegalEventStateException(String message) {
        super(message);
    }
}
