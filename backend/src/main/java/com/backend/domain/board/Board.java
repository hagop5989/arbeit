package com.backend.domain.board;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Board {

    private Integer id;
    private Integer memberId;
    private String title;
    private String content;
    private LocalDateTime inserted;
}
