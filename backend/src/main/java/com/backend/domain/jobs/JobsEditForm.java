package com.backend.domain.jobs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobsEditForm {
    private Integer id;
    private Integer memberId; //frk-member
    @NotBlank
    private String title;
    @NotBlank
    private String content;
    @NotNull
    private Integer salary;
    @NotNull
    private LocalDateTime deadline;
    @NotNull
    private Integer recruitmentNumber;
    @NotBlank
    private String education;
    @NotBlank
    private String educationDetail;
    @NotNull
    private Integer age;
    @NotNull
    private String preferred;
    @NotBlank
    private String workPeriod;
    @NotBlank
    private String workWeek;
    @NotBlank
    private String workTime;
    private List<MultipartFile> addImages;
    private List<String> removeImages;
}
