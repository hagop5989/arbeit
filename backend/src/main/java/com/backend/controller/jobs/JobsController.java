package com.backend.controller.jobs;

import com.backend.domain.jobs.Jobs;
import com.backend.service.jobs.JobsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/jobs")
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

    @GetMapping("{id}")
    public Jobs selectByPostId(@PathVariable Integer id) {
        return service.selectByJobsId(id);
    }

    @DeleteMapping("delete")
    public void delete(@RequestParam Integer id) {
        service.deleteByJobsId(id);
    }

    @GetMapping("list")
    public Map<String, Object> list(@RequestParam Integer memberId,
                                    @RequestParam(value = "page", defaultValue = "1") Integer page,
                                    @RequestParam(value = "type", required = false) String searchType,
                                    @RequestParam(value = "keyword", defaultValue = "") String keyword
    ) {
        return service.list(memberId, page, searchType, keyword);
    }

}
