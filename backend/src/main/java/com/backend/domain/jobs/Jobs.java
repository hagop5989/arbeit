package com.backend.domain.jobs;

import lombok.Data;

import java.time.LocalDateTime;
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

    // store 에서 가져옴
    private String storeName;

    // category 에서 가져옴
    private String categoryName;

    // account 에서 가져옴
    private String memberName;

    // jobsFile 에서 가져옴
    List<JobsFile> fileList;
}
