package com.backend.domain.member.form;

import com.backend.domain.authority.Authority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class MemberSignupForm {

    private Integer id;
    @NotBlank
    @Pattern(regexp = "^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$")
    private String email;
    @NotBlank
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\\d~!@#$%^&*()+|=]{8,16}$", message = "형식에 맞춰주세요.")
    private String password;
    @NotBlank
    private String passwordCheck;
    @NotBlank
    @Pattern(regexp = "^[가-힣]{2,5}$", message = "한글 최소 2자, 최대 5자")
    private String name;
    @NotBlank
    private String gender;
    @NotNull(message = "공백일 수 없습니다.")
    @Pattern(regexp = "^\\d{6}$", message = "숫자 6자리를 입력해주세요.")
    private String birthDate;
    @NotBlank
    private String address;
    @NotBlank
    @Pattern(regexp = "^010\\d{8}$", message = "전화번호 형식을 맞춰주세요.")
    private String phone;
    @NotNull
    private Authority authority;
}
