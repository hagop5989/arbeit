package com.backend.controller;

import com.backend.domain.boss.Boss;
import com.backend.service.boss.BossService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boss")
public class BossController {
    private final BossService service;

    @PostMapping("/insert")
    public ResponseEntity insert(@RequestBody Boss boss) {
        if(service.validate(boss)) {
            service.insert(boss);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/select")
    public void select() {
    }

    @PutMapping("/update")
    public void update(@RequestBody Boss boss) {
        service.update(boss);
    }

    @DeleteMapping("/delete")
    public void delete(@RequestBody Boss boss) {
        service.delete(boss);

    }

    @PostMapping("token")
    public ResponseEntity token(@RequestBody Boss boss) {
        Map<String, Object> token = service.getToken(boss);

        if(token == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(token);
    }

}
