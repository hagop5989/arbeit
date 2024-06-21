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

    @NotBlank
    private String name;
    @NotBlank
    private String content;
    @NotBlank
    private String address;
    @NotBlank
    private String detailAddress;
    @NotBlank
    @Pattern(regexp = "^[0-9]{9,11}$", message = "전화번호 형식에 맞춰주세요.")
    private String phone;
    @NotNull(message = "카테고리를 정해주세요.")
    private Integer categoryId;
}
