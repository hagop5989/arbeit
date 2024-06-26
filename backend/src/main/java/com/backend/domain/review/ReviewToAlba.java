package com.backend.domain.review;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ReviewToAlba {
    /* albaId,bossId 가 묶여서 pk */
    private Integer albaId; // fk
    private Integer bossId; // fk
    private String content;
    private Integer rating;
    private LocalDate inserted;

    // 밑에는 DB 에 없음
    private String authority;
    private String jobsTitle;
    private String albaName;

}
