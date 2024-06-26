package com.backend.domain.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationWriteForm {

    @NotNull(message = "이력서 선택을 필수입니다.")
    private Integer resumeId;

    @Pattern(regexp = "^[a-zA-Z가-힣0-9\\s]{10,}$", message = "최소 10자 이상 작성해주세요.")
    @NotBlank
    private String comment;
    @NotBlank
    private String title;
}
