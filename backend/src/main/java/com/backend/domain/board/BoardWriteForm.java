package com.backend.domain.board;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardWriteForm {
    @NotBlank
    private String title;
    @NotBlank
    private String content;
    @NotBlank
    private String files;
    @NotNull
    private String memberId;
    private String writer;
}
