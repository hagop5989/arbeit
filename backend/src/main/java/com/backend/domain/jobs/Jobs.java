package com.backend.domain.jobs;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
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

    private String memberName;
    private String storeName;
    private String address;
    private String categoryName;
}
