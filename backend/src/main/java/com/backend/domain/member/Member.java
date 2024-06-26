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

    public String getPhoneNumber() {
        if (phone.length() == 9) {
            return STR."\{phone.substring(0, 2)}-\{phone.substring(2, 5)}-\{phone.substring(5, 9)}";
        } else if (phone.length() == 10) {
            return STR."\{phone.substring(0, 3)}-\{phone.substring(3, 6)}-\{phone.substring(6, 10)}";
        } else {
            return STR."\{phone.substring(0, 3)}-\{phone.substring(3, 7)}-\{phone.substring(7, 11)}";
        }
    }
}
