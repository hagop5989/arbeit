package com.backend.domain.jobs.form;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Range;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobsEditForm {
    private Integer id;
    private Integer memberId; //frk-member
    @NotNull(message = "지점을 선택은 필수입니다.")
    private Integer storeId; //frk-store
    @NotNull
    private Integer categoryId; //frk-category

    @Pattern(regexp = "^[a-zA-Z가-힣0-9\\s\\[\\]\\(\\)\\-\\.,!?]{2,30}$", message = "최소 2글자, 최대 30글자")
    @NotBlank(message = "공고 제목을 입력해주세요.")
    private String title;

    @NotBlank(message = "추가 사항을 입력해주세요.")
    private String content;

    @Min(value = 9860, message = "최저시급은 '9860원'입니다.")
    @NotNull(message = "급여를 입력해주세요.")
    private Integer salary;

    @Future(message = "현재 시각 이후로 설정해주세요.")
    @NotNull(message = "공고 마감일을 선택해주세요.")
    private LocalDateTime deadline;

    @Range(min = 0, max = 99, message = "0 ~ 99 사이로 설정할 수 있습니다.")
    @NotNull(message = "모집인원을 입력해주세요.")
    private Integer recruitmentNumber;

    @NotBlank(message = "학력을 선택해주세요.")
    private String education;

    @NotBlank(message = "학력 상세을 선택해주세요.")
    private String educationDetail;

    @Range(min = 0, max = 90, message = "0 ~ 90 사이로 설정할 수 있습니다.")
    @NotNull(message = "최소 연령을 입력해주세요.")
    private Integer age;

    @NotBlank(message = "우대사항을 입력해주세요.")
    private String preferred;

    @NotBlank(message = "근무기간을 선택해주세요.")
    private String workPeriod;

    @NotBlank(message = "근무요일을 선택해주세요.")
    private String workWeek;

    @NotBlank(message = "근무시간을 선택해주세요.")
    private String workTime;

    private List<MultipartFile> addImages;
    private List<String> removeImages;
}
