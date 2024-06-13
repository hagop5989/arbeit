package com.backend.domain.jobs;

import lombok.Data;

@Data
public class JobsCondition {
    private Integer albaPostsId;
    private String education;
    private String educationDetail;
    private Integer age;
    private String preferred;
    private String workPeriod;
    private String workWeek;
    private String workTime;
}
