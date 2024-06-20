package com.backend.domain.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationWriteForm {

    @NotNull
    private Integer jobsId;
    @NotNull
    private Integer resumeId;
    @NotBlank
    private String comment;
    @NotBlank
    private String title;
}
