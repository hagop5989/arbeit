package com.backend.controller;

import com.backend.domain.boss.Boss;
import com.backend.domain.member.AlbaLoginForm;
import com.backend.service.alba.AlbaService;
import com.backend.service.boss.BossService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LoginController {

    private final BossService bossService;
    private final AlbaService albaService;

    @PostMapping(value = "/token", params = "type=ALBA")
    public ResponseEntity getTokenByAlba(@Validated @RequestBody AlbaLoginForm form, BindingResult bindingResult) {
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

    // TODO : Bean Validation 사용
    @PostMapping(value = "/token", params = "type=BOSS")
    public ResponseEntity token(@RequestBody Boss boss) {
        Map<String, Object> token = bossService.getToken(boss);

        if (token == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(token);
    }

    public static Map<String, String> getErrorMessages(BindingResult bindingResult) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return errors;
    }
}
