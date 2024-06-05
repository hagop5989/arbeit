package com.backend.domain.member;

import com.backend.domain.authority.Authority;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MemberSignupForm {

    private Integer id;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String name;
    @NotBlank
    private String address;
    @NotBlank
    private String phone;
    @NotNull
    private Authority authority;
}
