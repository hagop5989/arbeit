package com.backend.domain.jobs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class JobsCond {

    private Integer jobsId;
    private String education;
    private String educationDetail;
    private Integer age;
    private String preferred;
    private String workPeriod;
    private String workWeek;
    private String workTime;
}
