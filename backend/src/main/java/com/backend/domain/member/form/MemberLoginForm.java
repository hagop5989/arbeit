package com.backend.domain.member.form;

import com.backend.domain.authority.Authority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MemberLoginForm {

    @NotBlank
    private String email;
    @NotBlank
    private String password;
    @NotNull
    private Authority authority;
}
