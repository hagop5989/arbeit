package com.backend.domain.scrap;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Scrap {
    private Integer id;
    private Integer memberId;
    private Integer jobsId;
    private String jobsTitle;
    private Boolean favorite;

    //DB 없음
    private Integer jobsFavoriteCount;
    private LocalDate deadline;
}
