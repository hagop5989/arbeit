package com.backend.controller.application;

import com.backend.domain.application.Application;
import com.backend.service.application.ApplicationService;
import com.backend.service.management.ManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/jobs")
public class ApplicationController {
    private final ApplicationService service;
    private final ManagementService managementService;

    @GetMapping("{jobsId}/apply")
    public Map<String, Object> getInsertData(@PathVariable Integer jobsId, @MemberId Integer memberId) {
        return service.load(jobsId, memberId);
    }

    @PostMapping("{jobsId}/apply")
    public void insert(@RequestBody Application application) {
        service.insert(application);
        managementService.insert(application);
    }

    @GetMapping("apply/list")
    public List<Application> list(@MemberId Integer memberId) {
        return service.list(memberId);
    }

    @GetMapping("{jobsId}/apply/select")
    public Application select(@PathVariable Integer jobsId, @MemberId Integer memberId) {
        return service.select(jobsId, memberId);
    }

    @GetMapping("{jobsId}/apply/edit")
    public Map<String, Object> getUpdateData(@PathVariable Integer jobsId, @MemberId Integer memberId) {
        return service.getUpdateData(memberId, jobsId);
    }

    @PutMapping("{jobsId}/apply/edit")
    // todo: resumeId update 시 management에 반영.
    public void update(@RequestBody Application application) {
        service.update(application);
    }

    @DeleteMapping("{jobsId}/apply/delete")
    // todo: management 관련 처리 시 한쪽 service에서 한번에 처리해서 Transaction 보호 받도록 하기.
    public void delete(@PathVariable Integer jobsId, @MemberId Integer memberId) {
        managementService.delete(jobsId,memberId);
        service.delete(jobsId, memberId);
    }
}
