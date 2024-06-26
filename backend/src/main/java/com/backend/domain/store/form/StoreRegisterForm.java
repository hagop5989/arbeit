package com.backend.domain.store.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreRegisterForm {

    @Pattern(regexp = "^[a-zA-Z가-힣0-9\\s]{2,20}$", message = "최소 2글자, 최대 20글자")
    @NotBlank(message = "지점명을 입력해주세요.")
    private String name;
    @NotBlank(message = "지점을 소개해주세요.")
    private String content;
    @NotBlank(message = "주소를 등록해주세요.")
    private String address;
    @NotBlank(message = "주소를 등록해주세요.")
    private String detailAddress;
    @NotBlank
    @Pattern(regexp = "^[0-9]{9,11}$", message = "전화번호 형식에 맞춰주세요.")
    private String phone;
    @NotNull(message = "카테고리를 정해주세요.")
    private Integer categoryId;
}
