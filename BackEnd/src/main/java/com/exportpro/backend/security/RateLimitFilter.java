package com.exportpro.backend.security;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 10;

    private final Map<String, WindowCounter> requestCounts = new ConcurrentHashMap<>();

    private static class WindowCounter {
        long windowStart = Instant.now().getEpochSecond();
        AtomicInteger count = new AtomicInteger(0);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {

        if (!request.getRequestURI().equals("/api/auth/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = request.getRemoteAddr();
        long now = Instant.now().getEpochSecond();

        WindowCounter counter = requestCounts.computeIfAbsent(ip, k -> new WindowCounter());

        synchronized (counter) {
            if (now - counter.windowStart >= 60) {
                counter.windowStart = now;
                counter.count.set(0);
            }
            int current = counter.count.incrementAndGet();
            if (current > MAX_REQUESTS_PER_MINUTE) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Too many login attempts. Please try again later.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}