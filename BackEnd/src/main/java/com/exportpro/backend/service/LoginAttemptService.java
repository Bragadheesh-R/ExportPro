package com.exportpro.backend.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCKOUT_MINUTES = 15;

    private final Map<String, Integer> attempts = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> lockoutUntil = new ConcurrentHashMap<>();

    public boolean isLockedOut(String email) {
        LocalDateTime until = lockoutUntil.get(email);
        if (until == null) {
            return false;
        }
        if (LocalDateTime.now().isAfter(until)) {
            lockoutUntil.remove(email);
            attempts.remove(email);
            return false;
        }
        return true;
    }

    public void recordFailure(String email) {
        int count = attempts.merge(email, 1, Integer::sum);
        if (count >= MAX_ATTEMPTS) {
            lockoutUntil.put(email, LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES));
        }
    }

    public void recordSuccess(String email) {
        attempts.remove(email);
        lockoutUntil.remove(email);
    }
}