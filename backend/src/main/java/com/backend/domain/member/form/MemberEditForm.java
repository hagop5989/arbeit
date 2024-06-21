package com.backend.domain.member.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MemberEditForm {

    @NotBlank
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\\d~!@#$%^&*()+|=]{8,16}$", message = "형식에 맞춰주세요.")
    private String password;
    @NotBlank
    private String passwordCheck;
    @NotBlank
    @Pattern(regexp = "^[가-힣]{2,5}$", message = "한글 최소 2자, 최대 5자")
    private String name;
    @NotBlank
    private String address;
    @NotBlank
    @Pattern(regexp = "^010\\d{8}$", message = "전화번호 형식을 맞춰주세요.")
    private String phone;
}
