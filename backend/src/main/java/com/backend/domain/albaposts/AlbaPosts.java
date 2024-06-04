package com.backend.domain.albaposts;

import lombok.Data;

@Data
public class AlbaPosts {
    private Integer id;

    private String title;
    private String content;
    private String storeName;

    private String bossName;

    private Integer storeId;
    private Integer bossId;
}
