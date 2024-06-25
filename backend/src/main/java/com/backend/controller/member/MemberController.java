package com.backend.controller.member;

import com.backend.domain.member.Member;
import com.backend.domain.member.form.MemberEditForm;
import com.backend.service.member.MemberService;
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
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity info(@PathVariable("id") Integer id, Authentication authentication) {
        if (!memberService.hasAccess(id, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().body(memberService.findById(id));
    }

    @PostMapping("/check")
    public ResponseEntity check(@RequestBody String email) {
        if (email.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Member member = memberService.findByEmail(email);
        if (member != null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/list")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<Member> list() {
        return memberService.findAll();
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity edit(@Validated @RequestBody MemberEditForm form, BindingResult bindingResult,
                               @PathVariable("id") Integer id,
                               Authentication authentication) {

        Map<String, String> passwordMatch = memberService.passwordMatch(form);
        if (bindingResult.hasErrors() && passwordMatch != null) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            errors.put("passwordCheck", passwordMatch.get("passwordCheck"));
            return ResponseEntity.badRequest().body(errors);
        } else if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }


        if (!memberService.hasAccess(id, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        memberService.edit(form, authentication);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/delete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(@PathVariable("id") Integer id,
                                 @RequestParam String password,
                                 Authentication authentication) {

        if (!memberService.hasAccess(id, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (!memberService.canDelete(password, id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        memberService.deleteById(id);
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
