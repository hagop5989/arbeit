package com.backend.domain.boss;

import lombok.Data;

@Data
public class Boss {
    private Integer id;

    private String email;
    private String password;
    private String name;
    private String address;
    private String phone;
}
