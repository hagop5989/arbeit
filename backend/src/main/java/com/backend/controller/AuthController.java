package com.backend.controller;

import com.backend.domain.member.MemberLoginForm;
import com.backend.domain.member.MemberSignupForm;
import com.backend.service.member.MailService;
import com.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final MemberService memberService;
    private final MailService mailService;
    private static Map<String, String> numbers = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10);

    @PostMapping("/signup")
    public ResponseEntity signup(@Validated @RequestBody MemberSignupForm form, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }

        memberService.signup(form);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/token")
    public ResponseEntity getToken(@Validated @RequestBody MemberLoginForm form, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }

        Map<String, Object> map = memberService.getToken(form);

        if (map == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(map);
    }

    @PostMapping("/mail-send")
    public ResponseEntity mailSend(@RequestParam String email) {

        if (!mailService.checkRegex(email)) {
            return ResponseEntity.badRequest().build();
        }
        if (memberService.findByEmail(email) != null) {
            return ResponseEntity.ok().body(false);
        }
        try {
            String number = String.valueOf(mailService.sendMail(email));
            putValue(email, number);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }
    }

    @PostMapping("/mail-check")
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity mailCheck(@RequestParam String email, @RequestParam String authNumber) {
        String number = numbers.get(email);
        boolean isMatch = authNumber.equals(number);
        if (!isMatch) {
            return ResponseEntity.ok(false);
        } else {
            numbers.remove(email);
            return ResponseEntity.ok(true);
        }
    }

    @PostMapping("/find-email")
    public ResponseEntity findEmail(@RequestParam String name, @RequestParam String phone) {
        String email = memberService.findByNameAndPhone(name, phone);
        if (email != null) {
            return ResponseEntity.ok(email);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/auth-email")
    public ResponseEntity authEmail(@RequestParam String email) {
        if (!mailService.checkRegex(email)) {
            return ResponseEntity.badRequest().build();
        }
        try {
            String number = String.valueOf(mailService.sendMail(email));
            putValue(email, number);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }
    }

    @PostMapping("/password-update")
    public ResponseEntity passwordUpdate(@RequestParam String password, @RequestParam String passwordCheck,
                                         @RequestParam String email) {
        if (!memberService.checkRegexPwd(password)) {
            return ResponseEntity.badRequest().build();
        }
        if (!password.equals(passwordCheck)) {
            return ResponseEntity.badRequest().build();
        }

        memberService.updatePwdByEmail(email, password);
        return ResponseEntity.ok().build();
    }


    private void putValue(String key, String value) {
        numbers.put(key, value);
        scheduleRemoval(key, 2, TimeUnit.MINUTES);
    }

    private void scheduleRemoval(String key, long delay, TimeUnit unit) {
        scheduler.schedule(() -> {
            numbers.remove(key);
        }, delay, unit);
    }

    private static Map<String, String> getErrorMessages(BindingResult bindingResult) {
        Map<String, String> errors = new ConcurrentHashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return errors;
    }
}
