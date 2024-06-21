package com.backend.domain.resume;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Resume {
    private Integer id; // pk
    private Integer memberId; // fk
    private String gender;
    private LocalDate birthDate;
    private String email;
    private String phone;

    private String title;
    private String content;
    private Integer isRookie;
    private LocalDate inserted;

}
