package com.backend.domain.management;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Management {

    // application 테이블 사용.
    private Integer jobsId;
    private Integer appliedMemberId;
    private Integer resumeId;
    private Integer isPassed;

    // application db에 없음
    private Integer storeId;
    private String jobsTitle;
    private String applicationTitle;
    private LocalDate applicationInserted;
    private String albaName;
}
