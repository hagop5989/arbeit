package com.backend.controller.management;

import com.backend.controller.application.AuthId;
import com.backend.domain.application.Application;
import com.backend.domain.management.Management;
import com.backend.service.management.ManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/jobs")
public class ManagementController {
    private final ManagementService service;

    @PutMapping("/management/decision")
    public void updateDecision(@RequestBody Management management) {
        service.updateDecision(management);
    }

    @GetMapping("{resumeId}/management/select")
    public Application select(@RequestParam Integer jobsId, @PathVariable Integer resumeId) {
        return service.select(jobsId, resumeId);
    }

    @GetMapping("management/list")
    public List<Management> list(@AuthId Integer memberId) {
        return service.list(memberId);
    }

    @GetMapping("/managements-count")
    public Integer alarmCount(@AuthId Integer memberId) {
        return service.count(memberId);
    }
}
