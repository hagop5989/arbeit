package com.backend.domain.scrap;

import lombok.Data;

@Data
public class Scrap {
    private Integer id;
    private Integer memberId;
    private Integer jobsId;
    private String jobsTitle;
    private Boolean favorite;

    //DB 없음
    private Integer jobsFavoriteCount;
}
