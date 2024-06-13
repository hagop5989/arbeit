package com.backend.domain.store;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@AllArgsConstructor
public class Store {

    private Integer id;
    private String name;
    private String content;
    private String address;
    private String detailAddress;
    private String phone;
    private LocalDateTime inserted;
    private Integer memberId;
    private Integer categoryId;
    private String categoryName;

    public Store(String name, String content, String address, String detailAddress, String phone, Integer memberId, Integer categoryId) {
        this.name = name;
        this.content = content;
        this.address = address;
        this.detailAddress = detailAddress;
        this.phone = phone;
        this.memberId = memberId;
        this.categoryId = categoryId;
    }

    public String getInserted() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return inserted.format(formatter);
    }
}
