package com.backend.domain.store;

import lombok.Data;

@Data
public class Store {

    private int id;
    private String name;
    private String content;
    private String address;
    private String category;
    private Integer memberId;
    private Integer categoryId;

}
