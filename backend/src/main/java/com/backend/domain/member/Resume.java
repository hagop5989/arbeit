package com.backend.domain.member;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Resume {
    private Integer id;
    private Integer memberId;

    private String title;
    private String content;

    private List<ResumeFile> files;
}
