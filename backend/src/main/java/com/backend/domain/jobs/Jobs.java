package com.backend.domain.jobs;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Jobs {
    private Integer id;
    private Integer memberId;
    private Integer storeId;
    private String storeName;

    private String title;
    private String content;
    private LocalDateTime inserted;

    private String memberName;
}
