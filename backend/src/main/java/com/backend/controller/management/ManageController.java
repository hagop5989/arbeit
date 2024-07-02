package com.backend.controller.management;

import com.backend.config.AuthId;
import com.backend.domain.application.Contract;
import com.backend.domain.management.AlbaScore;
import com.backend.service.management.ManageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SCOPE_BOSS')")
@RestController
@RequestMapping("/api")
public class ManageController {

    private final ManageService service;

    @GetMapping("/application-manage/list")
    public List<Map<String, Object>> list(@AuthId Integer authId, Integer currentPage, String selectedType) {
        return service.findApplications(authId, currentPage, selectedType);
    }

    @GetMapping("/jobsId/{jobsId}/application-manage/detail/{albaId}")
    public Map<String, Object> view(@PathVariable Integer jobsId, @PathVariable Integer albaId) {
        return service.findApplicationByJobsIdAndAlbaId(jobsId, albaId);
    }

    @PutMapping("/jobsId/{jobsId}/application-manage/reject/{albaId}")
    public ResponseEntity reject(@PathVariable Integer jobsId, @PathVariable Integer albaId) {
        String canRejected = service.reject(jobsId, albaId);
        if (canRejected != null) {
            return ResponseEntity.badRequest().body(canRejected);
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/jobsId/{jobsId}/application-manage/pass")
    public ResponseEntity pass(@Validated @RequestBody Contract contract, BindingResult bindingResult,
                               @AuthId Integer authId) {

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("값이 올바르지 않아 처리할 수 없습니다.");
        }
        String canPassed = service.pass(contract, authId);
        if (canPassed != null) {
            return ResponseEntity.badRequest().body(canPassed);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/alba-list")
    public List<Map<String, Object>> albaList(@AuthId Integer authId) {
        List<Map<String, Object>> albaList = service.findAlbaList(authId);
        return albaList;
    }

    @PostMapping("/review/alba")
    public ResponseEntity reviewAlba(@RequestBody AlbaScore score, @AuthId Integer authId) {
        service.reviewToAlba(score, authId);
        return null;
    }

    @GetMapping("/application-manage/count")
    public Integer count(@AuthId Integer memberId) {
//        log.info("count.call");
        return service.count(memberId);
    }

}
