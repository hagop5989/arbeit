package com.backend.controller.alba;

import com.backend.domain.alba.Alba;
import com.backend.domain.alba.AlbaEditForm;
import com.backend.domain.alba.AlbaLoginForm;
import com.backend.domain.alba.AlbaSignupForm;
import com.backend.service.alba.AlbaService;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/alba")
public class AlbaController {

    private final AlbaService albaService;

    /**
     * create
     */
    @PostMapping("/signup")
    public ResponseEntity signup(@Validated @RequestBody AlbaSignupForm form, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }

        albaService.signup(form);
        return ResponseEntity.ok().build();
    }

    /**
     * read
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity info(@PathVariable("id") Integer id, Authentication authentication) {
        if (!albaService.hasAccess(id, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().body(albaService.findById(id));
    }

    /**
     * readAll
     */
    @GetMapping("/list")
    public List<Alba> list() {
        return albaService.findAll();
    }

    /**
     * login
     */
    @PostMapping(value = "/token", params = "type=ALBA")
    public ResponseEntity token(@Validated @RequestBody AlbaLoginForm form, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }

        Map<String, Object> map = albaService.getToken(form);
        if (map == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(map);
    }

    /**
     * update
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity edit(@Validated @RequestBody AlbaEditForm form, BindingResult bindingResult,
                               @PathVariable("id") Integer id,
                               Authentication authentication) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }

        if (!albaService.hasAccess(id, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        albaService.edit(form, authentication);
        return ResponseEntity.ok().build();
    }

    /**
     * delete
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(@PathVariable("id") Integer id,
                                 Authentication authentication) {
        if (!albaService.hasAccess(id, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        albaService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    private static Map<String, String> getErrorMessages(BindingResult bindingResult) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return errors;
    }
}
