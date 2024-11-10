package com.example.WebSocialMedia_Server.Util;

import com.example.WebSocialMedia_Server.Service.CustomUserDetailsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.*;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Lấy JWT từ header
        String jwt = getJwtFromRequest(request);

        logger.info("JWT Token: {}", jwt);

        if (jwt != null && jwtTokenProvider.validateToken(jwt)) {
            // Lấy tên người dùng từ JWT
            String username = jwtTokenProvider.getUsernameFromJwt(jwt);

            logger.info("Username from JWT: {}", username);

            // Tải thông tin người dùng
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Tạo đối tượng Authentication
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());

            // Đặt thông tin vào SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            logger.warn("JWT Token is null or invalid");
        }

        filterChain.doFilter(request, response);
    }

    // Hàm lấy JWT từ header
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        logger.info("Authorization Header: {}", bearerToken);

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        return null;
    }
}

