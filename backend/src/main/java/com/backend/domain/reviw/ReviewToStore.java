package com.backend.domain.reviw;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ReviewToStore {
    /* albaId,storeId 가 묶여서 pk */
    private Integer albaId; // fk
    private Integer storeId; // fk
    private String content;
    private Integer rating;
    private LocalDate inserted;

    // 밑에는 DB 에 없음
    private String authority;
    private String jobsTitle;
}
