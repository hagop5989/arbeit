package com.backend.domain.board.form;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Setter
public class BoardWriteForm {

    private Integer memberId;
    @NotBlank
    private String title;
    @NotBlank
    private String content;
}
