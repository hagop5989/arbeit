package com.backend.controller.member;

import com.backend.service.member.ProfilePictureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/profile")
public class ProfilePictureController {

    private final ProfilePictureService service;

    @PostMapping("/register")
    public ResponseEntity register(@RequestParam("files[]") MultipartFile files, @RequestParam("id") Integer memberId,
                                   Authentication authentication) throws IOException {
        service.register(files, memberId);
        return null;
    }

    @GetMapping("/{memberId}")
    public ResponseEntity view(@PathVariable("memberId") Integer memberId) {
        return ResponseEntity.ok().body(service.getProfileSrc(memberId));
    }
}
