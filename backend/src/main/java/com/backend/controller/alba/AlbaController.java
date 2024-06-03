package com.backend.controller.alba;

import com.backend.domain.alba.AlbaSignupForm;
import com.backend.service.alba.AlbaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/alba")
public class AlbaController {

    private final AlbaService albaService;

    @GetMapping("/signup")
    public ResponseEntity signup(@Validated @RequestBody AlbaSignupForm form, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }

        albaService.signup(form);
        return ResponseEntity.ok().build();
    }
}
