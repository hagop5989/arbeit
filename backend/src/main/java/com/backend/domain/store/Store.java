package com.backend.domain.store;

import lombok.Data;

import java.util.List;

@Data
public class Store {

    private int id;
    private String icon;
    private String name;
    private String content;
    private String address;
    private String cate;
    private String phone;
    private Integer memberId;
    private Integer categoryId;
    private String cateName;

    private List<StoreImg> imageList;

}
