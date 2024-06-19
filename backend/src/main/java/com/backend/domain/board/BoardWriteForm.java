package com.backend.domain.board;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Setter
public class BoardWriteForm {
    private Integer memberId;


    @NotBlank
    private String title;
    @NotBlank
    private String content;

    private List<MultipartFile> images;


}
