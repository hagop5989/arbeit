package com.backend.domain.board.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Setter
public class BoardEditForm {
    private Integer id;
    private Integer memberId;


    @Size(min = 5, max = 30, message = "글자 수는 최소 5자, 최대 30대 작성가능합니다.")
    @NotBlank
    private String title;
    @Size(min = 10, message = "최소 10자 이상 입력해주세요.")
    @NotBlank
    private String content;
}
