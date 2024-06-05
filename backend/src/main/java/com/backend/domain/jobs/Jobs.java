package com.backend.domain.jobs;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Jobs {
    private Integer id;
    private String title;
    private String content;
    private String storeName;
    private LocalDateTime inserted;
    private String bossName;
    private Integer storeId;
    private Integer bossId;

}
