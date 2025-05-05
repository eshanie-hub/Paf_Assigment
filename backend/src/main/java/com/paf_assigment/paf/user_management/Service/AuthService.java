package com.paf_assigment.paf.user_management.Service;

import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.paf_assigment.paf.user_management.dto.LoginRequest;
import com.paf_assigment.paf.user_management.dto.RegisterRequest;
import com.paf_assigment.paf.user_management.model.UserModel;
import com.paf_assigment.paf.user_management.repository.UserRepository;
import com.paf_assigment.paf.user_management.security.JwtUtil;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public HashMap<String, Object> registerUser(RegisterRequest request) {
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists!");
        }

        UserModel user = new UserModel();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepo.save(user);

        String token = jwtUtil.generateToken(user.getEmail());

        HashMap<String, Object> res = new HashMap<>();
        res.put("token", token);
        return res;
    }

    public HashMap<String, Object> loginUser(LoginRequest request) {
        Optional<UserModel> userOpt = userRepo.findByEmail(request.getEmail());

        HashMap<String, Object> response = new HashMap<>();
        if (userOpt.isEmpty()) {
            response.put("error", "Invalid email or password");
            return response;
        }

        UserModel user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            response.put("error", "Invalid email or password");
            return response;
        }

        String token = jwtUtil.generateToken(user.getUsername());
        response.put("token", token);
        response.put("username", user.getUsername());
        return response;
    }

}
