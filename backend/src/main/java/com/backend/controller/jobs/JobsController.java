package com.backend.controller.jobs;

import com.backend.domain.jobs.Jobs;
import com.backend.domain.jobs.JobsCondition;
import com.backend.domain.store.Store;
import com.backend.service.jobs.JobsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/jobs")
public class JobsController {
    private final JobsService service;

    @GetMapping("insert")
    public List<Store> findInsertData(Integer memberId) {
        return service.findInsertData(memberId);
    }

    @PostMapping("insert")
    public void insert(@ModelAttribute Jobs jobs,
                       @ModelAttribute JobsCondition jobsCondition,
                       @RequestParam(value = "files", required = false) MultipartFile[] files) throws IOException {
        service.insert(jobs, jobsCondition, files);
    }

    @PutMapping("update")
    public void update(@ModelAttribute Jobs jobs,
                       @ModelAttribute JobsCondition jobsCondition,
                       @RequestParam(value = "removeFileList[]", required = false)
                       List<String> removeFileList,
                       @RequestParam(value = "addFileList[]", required = false)
                       MultipartFile[] addFileList) throws IOException {
        service.update(jobs, jobsCondition, removeFileList, addFileList);
    }

    @GetMapping("{id}")
    public Map<String, Object> selectByJobsId(@PathVariable Integer id) {
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
        Map<String, Object> list = service.list(memberId, page, searchType, keyword);
        return list;
    }

}
