package com.backend.domain.board;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardLikeForm {

    private Integer boardId;
    private Integer memberId;
}
