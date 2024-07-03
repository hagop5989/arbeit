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

    @NotNull(message = "이력서 선택을 필수입니다.")
    private Integer resumeId;

    @NotBlank
    private String comment;
    @NotBlank
    private String title;
}
