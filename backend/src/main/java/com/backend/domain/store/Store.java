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

    public String getInserted() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return inserted.format(formatter);
    }

    public String getPhoneNumber() {
        if (phone.length() == 9) {
            return STR."\{phone.substring(0, 2)}-\{phone.substring(2, 5)}-\{phone.substring(5, 9)}";
        } else if (phone.length() == 10) {
            return STR."\{phone.substring(0, 3)}-\{phone.substring(3, 6)}-\{phone.substring(6, 10)}";
        } else if (phone.length() == 11){
            return STR."\{phone.substring(0, 3)}-\{phone.substring(3, 7)}-\{phone.substring(7, 11)}";
        } else {
            return phone;
        }
    }
}
