package com.backend.domain.management;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Management {
    private Integer id; // pk auto

    private Integer jobsId; // fk
    private Integer appliedMemberId; // fk
    private Integer resumeId; // fk
    private Integer isPassed; // 현재 fk 아님.

    // db 에 없음
    private String jobsTitle;
    private String applicationTitle;
    private LocalDate applicationInserted;
}
