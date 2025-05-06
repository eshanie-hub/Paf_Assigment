package com.paf_assigment.paf.user_management.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf_assigment.paf.user_management.Service.AuthService;
import com.paf_assigment.paf.user_management.dto.LoginRequest;
import com.paf_assigment.paf.user_management.dto.RegisterRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public HashMap<String, Object> register(@RequestBody RegisterRequest request) {
        return authService.registerUser(request);
    }

    @PostMapping("/login")
    public HashMap<String, Object> login(@RequestBody LoginRequest request) {
        return authService.loginUser(request);
    }

}