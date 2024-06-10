package com.backend.controller.member;

import com.backend.domain.member.Resume;
import com.backend.service.member.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member/resume")
public class ResumeController {
    private final ResumeService service;

    @PostMapping("insert")
    public void insert(@RequestBody Resume resume) {
//                       @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        System.out.println("resume = " + resume);
        service.insert(resume);
    }

    @GetMapping("list")
    public List<Resume> list(@RequestParam Integer memberId) {
        return service.list(memberId);
    }

    @GetMapping("{id}")
    public Resume select(@PathVariable Integer id) {
        System.out.println("ResumeController.select");
        return service.select(id);
    }

    @PutMapping("update")
    public void update(@RequestBody Resume resume) {
        System.out.println("ResumeController.update");
        service.update(resume);
    }

    @DeleteMapping("delete")
    public void delete(@RequestParam Integer id) {
        System.out.println("id = " + id);
        service.delete(id);
    }
}
