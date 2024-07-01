package com.backend.controller.jobs;

import com.backend.config.AuthId;
import com.backend.domain.jobs.form.JobsEditForm;
import com.backend.domain.jobs.form.JobsRegisterForm;
import com.backend.service.jobs.JobsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/jobs")
public class JobsController {
    private final JobsService service;
    private final ObjectMapper objectMapper;

    @Autowired
    public JobsController(ObjectMapper objectMapper, JobsService service) {
        this.objectMapper = objectMapper;
        this.service = service;
    }


    @GetMapping("/categories")
    public List<String> findCategories() {
        return service.findCategories();
    }

    @GetMapping("/store-names")
    @PreAuthorize("isAuthenticated()")
    public List<Map<String, Object>> findStoreNames(Authentication authentication) {
        return service.findStoreNamesByMemberId(authentication);
    }

    @PostMapping("/register")
    @PreAuthorize("hasAuthority('SCOPE_BOSS')")
    public ResponseEntity register(@Validated JobsRegisterForm form, BindingResult bindingResult,
                                   Authentication authentication) throws IOException {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }

        service.register(form, authentication);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity view(@PathVariable Integer id) {
        Object result = service.findById(id).getBody();
        try {
            objectMapper.writeValueAsString(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("JSON 직렬화 오류");
        }

        return service.findById(id);

    }

    @GetMapping("/list")
    public Map<String, Object> list(@RequestParam(value = "page", defaultValue = "1") Integer currentPage,
                                    @RequestParam(value = "type", required = false) String searchType,
                                    @RequestParam(value = "keyword", defaultValue = "") String keyword,
                                    @RequestParam(value = "filterType", defaultValue = "") String filterType,
                                    @RequestParam(value = "filterDetail", defaultValue = "") String filterDetail
    ) {
        return service.findAll(currentPage, searchType, keyword, filterType, filterDetail);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SCOPE_BOSS')")
    public ResponseEntity update(@Validated JobsEditForm form, BindingResult bindingResult,
                                 @AuthId Integer authId) throws IOException {

        if (!service.hasAccess(form.getMemberId(), authId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }

        service.update(form);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SCOPE_BOSS')")
    public ResponseEntity delete(@PathVariable Integer id, @AuthId Integer authId) {

        if (!service.hasAccess(service.findMemberIdById(id), authId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        service.deleteByJobsId(id);
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
