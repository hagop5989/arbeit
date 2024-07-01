package com.backend.domain.board.form;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CommentEditForm {

    private int id;
    private int boardid;

    @NotBlank
    private String comment;

}

