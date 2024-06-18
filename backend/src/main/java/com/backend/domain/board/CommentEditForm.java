package com.backend.domain.board;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CommentEditForm {

    private int id;
    private int boardid;

    @NotNull
    private String comment;

}

