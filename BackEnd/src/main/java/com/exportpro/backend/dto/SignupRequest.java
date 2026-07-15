package com.exportpro.backend.dto;

import com.exportpro.backend.model.Role;
import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
}