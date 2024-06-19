package com.backend.domain.board;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
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
