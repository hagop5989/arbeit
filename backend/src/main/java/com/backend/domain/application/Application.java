package com.backend.domain.application;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Application {
    // fk, pk(jobsId, memberId)
    private Integer jobsId;
    private Integer memberId;
    private Integer resumeId;

    private String title;
    private String comment;

    private Integer isPassed; // Null 가능
    private LocalDate inserted; // Default Now()

    // db 에 없음
    private String jobsTitle;

}
