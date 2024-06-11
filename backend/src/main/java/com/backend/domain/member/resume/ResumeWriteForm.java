package com.backend.domain.member.resume;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeWriteForm {
    private Integer id;
    private Integer memberId;
    @NotBlank
    private String title;
    @NotBlank
    private String content;
    @NotNull
    private boolean isRookie;
}
