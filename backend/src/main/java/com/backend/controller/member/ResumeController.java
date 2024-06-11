package com.backend.controller.member;

import com.backend.domain.member.resume.Resume;
import com.backend.service.member.ResumeService;
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
@RequestMapping("/api")
public class ResumeController {
    private final ResumeService resumeService;

    @PostMapping("/resume/write")
    @PreAuthorize("hasAuthority('SCOPE_ALBA')")
    public ResponseEntity insert(@Validated @RequestBody Resume resume, BindingResult bindingResult,
                                 Authentication authentication) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }

        if (!resumeService.isMaxedInsert(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        resumeService.insert(resume, authentication);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/resume/list")
    @PreAuthorize("isAuthenticated()")
    public List<Resume> list(@PathVariable("id") Integer memberId, Authentication authentication) {
        return resumeService.findAllByMemberId(memberId);
    }

    @GetMapping("/resume/{id}")
    @PreAuthorize("isAuthenticated()")
    public Resume view(@PathVariable("id") Integer id,
                       Authentication authentication) {

        return resumeService.findById(id);
    }

    @PutMapping("/resume/{id}")
    public void edit(@RequestBody Resume resume) {
        resumeService.update(resume);
    }

    @DeleteMapping("delete")
    public void delete(@RequestParam Integer id) {
        resumeService.delete(id);
    }

    private static Map<String, String> getErrorMessages(BindingResult bindingResult) {
        Map<String, String> errors = new ConcurrentHashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return errors;
    }
}
