package com.backend.controller;

import com.backend.controller.application.AuthId;
import com.backend.service.application.ApplicationService;
import com.backend.service.jobs.JobsService;
import com.backend.service.resume.ResumeService;
import com.backend.service.store.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class AccessController {

    private final StoreService storeService;
    private final JobsService jobsService;
    private final ApplicationService applicationService;
    private final ResumeService resumeService;

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
    public ResponseEntity onlySameId(@RequestParam("id") Integer storeId, @AuthId Integer authId) {
        Integer memberId = storeService.findMemberIdByAuthId(storeId);
        if (memberId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (memberId.equals(authId)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping("/access-jobs")
    @PreAuthorize("hasAuthority('SCOPE_BOSS')")
    public ResponseEntity onlyBossSameId(@RequestParam("id") Integer jobsId, @AuthId Integer authId) {
        Integer memberId = jobsService.findMemberIdById(jobsId);
        if (memberId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (memberId.equals(authId)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping("/access-resume")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity onlyAuthMember(@RequestParam("id") Integer resumeId, @AuthId Integer authId) {
        if (!resumeService.accessValidate(resumeId, authId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().build();
    }
}
