package com.backend.controller.board;


import com.backend.domain.board.BoardEditForm;
import com.backend.domain.board.BoardWriteForm;
import com.backend.mapper.board.BoardMapper;
import com.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Slf4j
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final BoardMapper boardMapper;


    @PostMapping("/write")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity write(@Validated BoardWriteForm form, BindingResult bindingResult,
                                Authentication authentication) throws IOException {
        System.out.println("form = " + form);

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }

        boardService.write(form, authentication);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> findById(@PathVariable Integer id, Authentication authentication) {
        try {
            Map<String, Object> result = boardService.findById(id, authentication);
            if (result == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok().body(result);
        } catch (Exception e) {
            // 예외 처리
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

    @GetMapping("list")
    public Map<String, Object> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(value = "type", required = false) String searchType,
            @RequestParam(value = "keyword", defaultValue = "") String keyword
    ) {
        System.out.println("page = " + page);
        System.out.println("searchType = " + searchType);
        System.out.println("keyword = " + keyword);
        return boardService.list(page, searchType, keyword);
    }


    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity edit(
            @Validated BoardEditForm form, BindingResult bindingResult,
            Authentication authentication) throws IOException {
        System.out.println("form = " + form);

        if (!boardService.hasAccess(form, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        boardService.edit(form, authentication);
        return ResponseEntity.ok().build();


    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        boardService.delete(id);
    }

    private static Map<String, String> getErrorMessages(BindingResult bindingResult) {
        Map<String, String> errors = new ConcurrentHashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return errors;
    }


    @PutMapping("like")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> like(@RequestBody Map<String, Object> req,
                                    Authentication authentication) throws IOException {
        System.out.println("req = " + req);
        return boardService.like(req, authentication);


    }


}


