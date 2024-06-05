package com.backend.controller.jobs;

import com.backend.domain.albaposts.Jobs;
import com.backend.service.albaposts.JobsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boss/jobs")
public class JobsController {
    private final JobsService service;

    @PostMapping("insert")
    public void insert(@RequestBody Jobs jobs) {
        service.insert(jobs);
    }

    @PutMapping("update")
    public void update(@RequestBody Jobs jobs) {
        service.update(jobs);
    }

    @GetMapping("select")
    public Jobs selectByPostId(@RequestParam Integer jobsId) {
        return service.selectByJobsId(jobsId);
    }

    @GetMapping("list")
    public List<Jobs> list(@RequestParam Integer bossId) {
        return service.findAllByBossId(bossId);
    }

    @DeleteMapping("delete")
    public void delete(@RequestParam Integer jobsId) {
        service.deleteByJobsId(jobsId);
    }

}
