package com.paf_assigment.paf.user_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paf_assigment.paf.user_management.model.UserModel;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserModel, Long> {
    Optional<UserModel> findByEmail(String email);

}