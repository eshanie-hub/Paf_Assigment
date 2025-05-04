package com.paf_assigment.paf.user_management.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.paf_assigment.paf.user_management.repository.UserRepository;
import com.paf_assigment.paf.user_management.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        if (email == null) {
            throw new RuntimeException("Email not provided by OAuth provider");
        }

        // Generate JWT directly, no DB lookup
        String jwt = jwtUtil.generateToken(email);

        String username = oAuth2User.getAttribute("name") != null
                ? oAuth2User.getAttribute("name")
                : "OAuthUser";

        // Send token back via redirect
        String redirectUrl = "http://localhost:3000/login?token=" + jwt + "&username=" +
                URLEncoder.encode(username, StandardCharsets.UTF_8);

        response.sendRedirect(redirectUrl);
    }
}