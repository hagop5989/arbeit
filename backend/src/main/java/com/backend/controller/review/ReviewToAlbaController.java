package com.backend.controller.review;

import com.backend.controller.application.AuthId;
import com.backend.domain.contract.Contract;
import com.backend.domain.review.ReviewToAlba;
import com.backend.domain.reviw.ReviewToStore;
import com.backend.service.contract.ContractService;
import com.backend.service.review.ReviewToAlbaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/review/alba")
public class ReviewToAlbaController {
    /* 사장 -> 알바 평가 */
    private final ReviewToAlbaService service;
    private final ContractService contractService;

    /* 사장이 알바 평가 */
    @GetMapping("list")
    public Map<String, Object> list(Authentication authentication) {
        Integer bossId = Integer.valueOf(authentication.getName());
        HashMap<String, Object> map = new HashMap<>();
        List<Contract> contractList = contractService.list(bossId, authentication);

        map.put("contractList", contractList);
        map.put("reviewList", service.list(bossId));
        return map;
    }

    /* 알바가 가게 평가 */
    @GetMapping("to-store")
    public List<ReviewToStore> listToStore(@AuthId Integer bossId) {
        return service.listToStore(bossId);

    }

    @PostMapping("")
    public void insert(@RequestBody ReviewToAlba review) {
        service.insert(review);
    }

    @PutMapping
    public void update(@RequestBody ReviewToAlba review) {
        service.update(review);
    }


    @DeleteMapping("{albaId}")
    public void delete(@PathVariable Integer albaId, @AuthId Integer bossId) {
        service.delete(albaId, bossId);

    }
}
