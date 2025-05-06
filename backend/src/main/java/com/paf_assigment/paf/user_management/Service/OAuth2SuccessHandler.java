package com.paf_assigment.paf.user_management.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.paf_assigment.paf.user_management.model.UserModel;
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
        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");

            if (email == null) {
                throw new RuntimeException("Email not provided by OAuth provider");
            }

            // Check if user exists, else create and save
            UserModel user = userRepository.findByEmail(email).orElseGet(() -> {
                UserModel newUser = new UserModel();
                newUser.setEmail(email);
                newUser.setUsername(name != null ? name : "OAuthUser");
                newUser.setPassword(""); // OAuth users don't have a password

                // Save once to generate ID
                newUser = userRepository.save(newUser);

                // Set userId from generated ID and save again
                newUser.setId(newUser.getId());
                return userRepository.save(newUser);
            });

            // Generate JWT with claims
            String jwt = jwtUtil.generateTokenWithClaims(email, Map.of(
                    "userId", user.getId(),
                    "username", user.getUsername()));

            // Redirect with token and user info
            String redirectUrl = "http://localhost:3000/?token=" + jwt +
                    "&username=" + URLEncoder.encode(user.getUsername(), StandardCharsets.UTF_8) +
                    "&userId=" + URLEncoder.encode(user.getId().toString(), StandardCharsets.UTF_8);

            response.sendRedirect(redirectUrl);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "OAuth Login Error: " + e.getMessage());
        }
    }
}
