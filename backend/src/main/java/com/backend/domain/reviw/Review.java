package com.backend.domain.reviw;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Review {
    /* memberId,jobsId 가 묶여서 pk */
    private Integer memberId; // fk
    private Integer jobsId; // fk
    private String authority; // trigger 연동, 입력안해도 됨.
    private String jobsTitle;
    private String content;
    private Integer rating;
    private LocalDate inserted;


}
