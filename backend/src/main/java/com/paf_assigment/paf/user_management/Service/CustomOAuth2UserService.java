package com.paf_assigment.paf.user_management.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.paf_assigment.paf.user_management.model.UserModel;
import com.paf_assigment.paf.user_management.repository.UserRepository;
import com.paf_assigment.paf.user_management.security.JwtUtil;

import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private static final AtomicLong counter = new AtomicLong();
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth provider");
        }

        UserModel user = userRepository.findByEmail(email).orElseGet(() -> {
            UserModel newUser = new UserModel();
            newUser.setEmail(email);
            newUser.setUsername(name != null ? name : "OAuthUser");
            newUser.setPassword(""); // no password for OAuth users

            newUser = userRepository.save(newUser);
            newUser.setId(newUser.getId());
            return userRepository.save(newUser);
        });

        return oAuth2User;
    }
}