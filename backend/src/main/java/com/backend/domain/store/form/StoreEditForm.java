package com.backend.domain.store.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreEditForm {

    @NotNull
    private Integer id;
    @NotBlank
    private String name;
    @NotBlank
    private String content;
    @NotBlank
    private String address;
    @NotBlank
    private String detailAddress;
    @NotBlank
    private String phone;
    @NotNull
    private Integer memberId;
    @NotNull
    private Integer categoryId;
    @NotNull
    private String categoryName;
}
