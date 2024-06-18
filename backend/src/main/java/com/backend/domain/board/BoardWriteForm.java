package com.backend.domain.board;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardWriteForm {
    private Integer memberId;
    @NotBlank
    private String title;
    @NotBlank
    private String content;


}
