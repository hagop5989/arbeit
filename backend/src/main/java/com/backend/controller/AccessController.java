package com.backend.controller;

import com.backend.service.store.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class AccessController {

    private final StoreService storeService;

    @GetMapping("/only-boss")
    @PreAuthorize("hasAuthority('SCOPE_BOSS')")
    public void onlyBoss() { //
    }

    @GetMapping("/only-alba")
    @PreAuthorize("hasAuthority('SCOPE_ALBA')")
    public void onlyAlba() { //
    }

    @GetMapping("/only-admin")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void onlyAdmin() { //
    }

    @GetMapping("/only-login")
    @PreAuthorize("isAuthenticated()")
    public void onlyLogin() { //
    }


    @PostMapping("/access-store")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity onlySameId(@RequestParam Integer id, Authentication authentication) {
        Integer memberId = storeService.findMemberIdByAuthId(id);
        if (memberId.equals(Integer.valueOf(authentication.getName()))) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
