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

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Slf4j
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping("/write")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity write(@Validated @RequestBody BoardWriteForm form, BindingResult bindingResult,
                                Authentication authentication) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }

        boardService.write(form, authentication);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/list")
    public List<Board> list() {
        return boardService.list();
    }

    @GetMapping("/{id}")
    public ResponseEntity info(@PathVariable Integer id) {
        log.info("BoardController.info id={}", id);
        Board board = boardService.findById(id);

        if (board == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(board);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity edit(@Validated @RequestBody BoardEditForm form, BindingResult bindingResult,
                               @PathVariable("id") Integer id,
                               Authentication authentication) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        if (!boardService.hasAccess(id, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        boardService.edit(form, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(@PathVariable Integer id, Authentication authentication) {

        if (!boardService.hasAccess(id, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        boardService.delete(id);
        return ResponseEntity.ok().build();
    }

    private static Map<String, String> getErrorMessages(BindingResult bindingResult) {
        Map<String, String> errors = new ConcurrentHashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return errors;
    }
}
