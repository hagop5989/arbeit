package com.backend.domain.alba;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@NotBlank
public class AlbaSignupForm {

    @Email
    private String email;
    private String password;
    private String name;
    private String address;
    private String phone;
}
