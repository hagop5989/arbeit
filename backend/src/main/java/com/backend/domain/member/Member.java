package com.backend.domain.member;

import com.backend.domain.authority.Authority;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    private Integer id;
    private String email;
    @Setter
    private String password;
    private String name;
    private String address;
    private String phone;
    private Authority authority;
    private LocalDateTime inserted;
}
