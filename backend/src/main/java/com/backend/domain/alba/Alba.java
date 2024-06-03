package com.backend.domain.alba;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Alba {

    private Integer id;
    private String email;
    private String password;
    private String name;
    private String address;
    private String phone;
    private LocalDateTime inserted;
}
