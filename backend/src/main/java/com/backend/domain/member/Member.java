package com.backend.domain.member;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    private Integer id;
    private String email;
    @Setter
    private String password;
    private String name;
    private String gender;
    private Date birthDate;
    private String address;
    private String phone;
    private LocalDateTime inserted;

    public String getBirthDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(birthDate);
    }
}
