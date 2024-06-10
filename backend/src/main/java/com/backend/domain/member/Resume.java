package com.backend.domain.member;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Resume {
    private Integer id; // pk
    private Integer memberId; // fk

    private String title;
    private String content;
    private String gender;
    private LocalDate birthDate;
    private boolean rookie;
    private String address1;
    private String address2;
    private String email;
    private String phone;
    private Integer preferredPay;
    private String workDayType;
    private String workShiftType;
    private LocalDate deadline;
    private String preferredJob;
    private LocalDate inserted;

//    private List<ResumeFile> files;
}
