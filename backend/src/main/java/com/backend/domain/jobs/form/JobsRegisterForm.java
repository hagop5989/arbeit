package com.backend.domain.jobs.form;

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
public class JobsRegisterForm {
    private Integer memberId; //frk-member
    @NotNull(message = "지점을 선택은 필수입니다.")
    private Integer storeId; //frk-store
    @NotNull
    private Integer categoryId; //frk-category
    @NotBlank(message = "공고 제목을 입력해주세요.")
    private String title;
    @NotBlank(message = "추가 사항을 입력해주세요.")
    private String content;
    @NotNull(message = "급여를 입력해주세요.")
    private Integer salary;
    @NotNull(message = "공고 마감일을 선택해주세요.")
    private LocalDateTime deadline;
    @NotNull(message = "모집인원을 입력해주세요.")
    private Integer recruitmentNumber;
    @NotBlank(message = "학력을 선택해주세요.")
    private String education;
    @NotBlank(message = "학력 상세을 선택해주세요.")
    private String educationDetail;
    @NotNull(message = "최소 연령을 입력해주세요.")
    private Integer age;
    @NotBlank(message = "우대 사항을 입력해주세요.")
    private String preferred;
    @NotBlank(message = "근무 기간을 선택해주세요.")
    private String workPeriod;
    @NotBlank(message = "근무 요일을 선택해주세요.")
    private String workWeek;
    @NotBlank(message = "근무 시간을 선택해주세요.")
    private String workTime;
    private List<MultipartFile> images;
}
