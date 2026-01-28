package com.insurance.management.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.insurance.management.dto.response.ApiResponse;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomJwtVerificationFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                log.info("**** Bearer Token found ");
                String jwt = authHeader.substring(7);
                Claims claims = jwtUtils.validateToken(jwt);
                String userId = claims.get("user_id", String.class);
                String role = claims.get("user_role", String.class);
                List<SimpleGrantedAuthority> grantedAuthorities = List.of(new SimpleGrantedAuthority(role));

                UserPrincipal principal = new UserPrincipal(userId, claims.getSubject(), null, grantedAuthorities,
                        role);
                Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null,
                        grantedAuthorities);
                log.info("*******auth {}", authentication);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("**** store auth under sec ctx");
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("Invalid JWT {} ", e);
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            ApiResponse resp = new ApiResponse("Failed", e.getMessage());
            response.getWriter().write(objectMapper.writeValueAsString(resp));
        }
    }
}
