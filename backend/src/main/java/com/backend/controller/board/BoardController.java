package com.backend.controller.board;


import com.backend.domain.board.Board;
import com.backend.domain.board.BoardEditForm;
import com.backend.domain.board.BoardWriteForm;
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
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Slf4j
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {


    private final BoardService boardService;


    @ControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<Map<String, String>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
            Map<String, String> response = new HashMap<>();
            response.put("title", "");
            response.put("content", "");
            response.put("error", "잘못된 요청입니다.");

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

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
    public ResponseEntity info(@PathVariable Integer id) {
        Map<String, Object> result = boardService.findById(id);


        if (result == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(result);
    }


    @GetMapping("/list")
    public List<Board> list() {
        return boardService.list();
    }


    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity edit(@Validated BoardEditForm form, BindingResult bindingResult,
                               Authentication authentication) throws IOException {


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
}
