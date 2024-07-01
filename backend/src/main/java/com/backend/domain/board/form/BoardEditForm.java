package com.backend.domain.board.form;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Setter
public class BoardEditForm {
    private Integer id;
    private Integer memberId;

    @NotBlank
    private String title;
    @NotBlank
    private String content;

    private List<MultipartFile> addImages;
    private List<String> removeImages;


}
