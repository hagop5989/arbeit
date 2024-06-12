package com.backend.domain.jobs;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class Jobs {
    private Integer id; //prk
    private Integer memberId; //frk-member
    private Integer storeId; //frk-store
    private Integer categoryId; //frk-category
    private String title;
    private String content;
    private Integer salary;
    private LocalDateTime deadline;
    private Integer recruitmentNumber;

    private String storeName;
    private LocalDateTime inserted;

    private LocalTime startTime;
    private LocalTime endTime;
    private String markerName;
    private Double x;
    private Double y;


    // 아래는 db에 없음.
    private String categoryName;
    private String memberName;
    List<JobsFile> fileList;
}
