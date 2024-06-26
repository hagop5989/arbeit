package com.backend.controller.management;

import com.backend.controller.application.AuthId;
import com.backend.domain.application.Application;
import com.backend.domain.management.Management;
import com.backend.service.management.ManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/jobs")
@PreAuthorize("hasAuthority('SCOPE_BOSS')")
public class ManagementController {
    private final ManagementService service;

    @PutMapping("/management/decision")
    public void updateDecision(@RequestBody Management management) {
        service.updateDecision(management);
    }

    @GetMapping("/{jobsId}/management/application-view")
    public Application select(@RequestParam Integer resumeId, @PathVariable Integer jobsId) {
        return service.select(jobsId, resumeId);
    }

    @GetMapping("management/list")
    public Map<String, Object> list(@AuthId Integer memberId, @RequestParam(value = "page", defaultValue = "1") Integer currentPage) {
        return service.list(memberId, currentPage);
    }

    @GetMapping("/managements-count")
    public Integer alarmCount(@AuthId Integer memberId) {
        return service.count(memberId);
    }
}
