package com.backend.domain.board.form;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CommentWriterForm {

    private Integer id;
    private Integer boardId;
    private Integer memberId;
    @NotBlank
    private String comment;


}
