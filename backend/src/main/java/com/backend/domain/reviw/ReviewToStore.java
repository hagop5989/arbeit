package com.backend.domain.reviw;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // 필드에 정의되지 않은 것이 넘어올 경우 무시.
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
