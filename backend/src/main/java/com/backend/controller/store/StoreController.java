package com.backend.controller.store;

import com.backend.domain.store.Store;
import com.backend.service.store.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService service;

    @GetMapping("cate")
    public List<Store> getAllCate() {
        return service.cate();
    }

    @PostMapping("/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity add(Authentication authentication,
                              @ModelAttribute Store store,
                              @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {

        if (service.validate(store)) {
            service.add(store, files, authentication);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().body("Validation failed");
        }
    }

    @GetMapping("list")
    public List<Store> list() {

        return service.list();
    }

    @GetMapping("{id}")
    public ResponseEntity get(@PathVariable Integer id) {
        Store store = service.get(id);
        return ResponseEntity.ok().body(store);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(@PathVariable Integer id, Authentication authentication) {

        if (service.hasAccess(id, authentication)) {
            service.remove(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity edit(Store store,
                               @RequestParam(value = "removeFileList[]", required = false)
                               List<String> removeFileList,
                               @RequestParam(value = "addFileList[]", required = false)
                               MultipartFile[] addFileList,
                               Authentication authentication) throws IOException {
        log.info("store={}", store);
        if (!service.hasAccess(store.getId(), authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        service.edit(store, removeFileList, addFileList);
        return ResponseEntity.ok().build();
    }

}
