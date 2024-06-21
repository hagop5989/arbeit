package com.backend.controller.store;

import com.backend.domain.store.Category;
import com.backend.domain.store.Store;
import com.backend.domain.store.form.StoreEditForm;
import com.backend.domain.store.form.StoreRegisterForm;
import com.backend.service.store.StoreService;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @GetMapping("/category")
    public List<Category> getCategory() {
        return storeService.findAllCategory();
    }

    @PostMapping("/register")
    @PreAuthorize("hasAuthority('SCOPE_BOSS')")
    public ResponseEntity register(@Validated StoreRegisterForm form, BindingResult bindingResult,
                                   @RequestParam(value = "files[]", required = false) MultipartFile[] files,
                                   Authentication authentication) throws IOException {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }

        storeService.register(form, files, authentication);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/list")
    @PreAuthorize("hasAuthority('SCOPE_BOSS')")
    public List<Store> list(Authentication authentication) {
        return storeService.findAllByMemberId(authentication);
    }

    @GetMapping("/{id}")
    public ResponseEntity view(@PathVariable Integer id) {
        Map<String, Object> result = storeService.findStoreById(id);

        if (result == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SCOPE_BOSS')")
    public ResponseEntity edit(@Validated StoreEditForm form, BindingResult bindingResult,
                               @RequestParam(value = "removeImage", required = false)
                               String removeImage,
                               @RequestParam(value = "addImage[]", required = false)
                               MultipartFile addImage,
                               Authentication authentication) throws IOException {

        if (!storeService.hasAccess(form.getId(), authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = getErrorMessages(bindingResult);
            return ResponseEntity.badRequest().body(errors);
        }

        storeService.edit(form, removeImage, addImage);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SCOPE_BOSS')")
    public ResponseEntity remove(@PathVariable Integer id, Authentication authentication) {

        if (!storeService.hasAccess(id, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        storeService.removeById(id);
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
