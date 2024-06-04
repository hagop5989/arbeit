package com.backend.domain.alba;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AlbaLoginForm {

    @NotBlank
    private String email;
    @NotBlank
    private String password;
}
