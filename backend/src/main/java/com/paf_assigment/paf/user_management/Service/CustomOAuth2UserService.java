package com.paf_assigment.paf.user_management.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.paf_assigment.paf.user_management.model.UserModel;
import com.paf_assigment.paf.user_management.repository.UserRepository;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);

        String email = user.getAttribute("email");
        String name = user.getAttribute("name");

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth provider");
        }

        userRepository.findByEmail(email).orElseGet(() -> {
            UserModel newUser = new UserModel();
            newUser.setEmail(email);
            newUser.setUsername(name != null ? name : "GoogleUser");
            newUser.setPassword(""); // no password for OAuth users
            return userRepository.save(newUser);
        });

        return user;

    }
}