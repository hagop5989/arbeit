package com.backend.controller.review;

import com.backend.controller.application.AuthId;
import com.backend.domain.contract.Contract;
import com.backend.domain.review.ReviewToAlba;
import com.backend.domain.reviw.ReviewToStore;
import com.backend.service.contract.ContractService;
import com.backend.service.review.ReviewToStoreService;
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
@RequestMapping("/api/review/store")
public class ReviewToStoreController {
    /* 알바 -> 가게 평가 */
    private final ReviewToStoreService service;
    private final ContractService contractService;

    @PostMapping
    public void insert(@RequestBody ReviewToStore reviewToStore) {
        service.insert(reviewToStore);
    }

    /* 알바가 가게 평가 */
    @GetMapping("list")
    public Map<String, Object> list(Authentication authentication) {
        Integer memberId = Integer.valueOf(authentication.getName());
        HashMap<String, Object> map = new HashMap<>();
        List<Contract> contractList = contractService.list(memberId, authentication);

        map.put("contractList", contractList);
        map.put("reviewList", service.listForAlba(memberId));

        return map;
    }

    /* 사장이 알바 평가 */
    @GetMapping("to-alba")
    public List<ReviewToAlba> listToAlba(@AuthId Integer albaId) {
        return service.listToAlba(albaId);
    }

    @PutMapping("")
    public void update(@RequestBody ReviewToStore reviewToStore) {
        service.update(reviewToStore);
    }

    @DeleteMapping("{storeId}")
    public void delete(@PathVariable Integer storeId, @AuthId Integer memberId) {
        service.delete(storeId, memberId);
    }


}
