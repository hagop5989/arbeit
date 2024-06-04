package com.backend.controller.boss;

import com.backend.domain.boss.Boss;
import com.backend.service.boss.BossService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boss")
public class BossController {
    private final BossService service;

    @PostMapping("/insert")
    public ResponseEntity insert(@RequestBody Boss boss) {
        if (service.validate(boss)) {
            service.insert(boss);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/select")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity select(@RequestParam Integer id,
                                 Authentication authentication) {
        if (service.hasAccess(id, authentication)) {
            Boss boss = service.selectById(id);
            return ResponseEntity.ok().body(boss);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity update(@RequestBody Boss boss, Authentication authentication) {
        if (service.hasAccess(boss.getId(), authentication)) {
            service.update(boss);
            return ResponseEntity.ok().build();
        } else if (!service.validate(boss)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.internalServerError().build();
    }

    @DeleteMapping("/delete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(@RequestParam Integer id,
                                 Authentication authentication) {
        if (service.hasAccess(id, authentication)) {
            service.delete(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.internalServerError().build();
    }

    @PostMapping("token")
    public ResponseEntity token(@RequestBody Boss boss) {
        Map<String, Object> token = service.getToken(boss);

        if (token == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(token);
    }

    @GetMapping("signupCheck")
    public ResponseEntity checkSignup(@RequestParam String email) {
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return service.signupBossEmailCheck(email);
    }
}
