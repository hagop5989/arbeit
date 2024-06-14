package com.backend.domain.application;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Application {
    private Integer jobsId; // fk
    private Integer memberId; // fk
    private Integer resumeId; // fk

    private String title;
    private String comment;

    private Integer isPassed; // Null 가능
    private LocalDate inserted; // Default Now()

    // db 에 없음
    private String jobsTitle;

}
