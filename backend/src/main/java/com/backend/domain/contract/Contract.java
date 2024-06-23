package com.backend.domain.contract;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Contract {
    /* jobsId,albaId,bossId 3개가 묶여서 pk */
    private Integer jobsId; // fk  (jobs)
    private Integer albaId; // fk (member)
    private Integer bossId; // fk (member)
    private LocalDate startDate;
    private LocalDate endDate;

    // Review db에 없음
    private String albaName;
    private String jobsTitle;
    private String storeName;

}
