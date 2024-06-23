package com.backend.controller.review;

import com.backend.controller.application.AuthId;
import com.backend.domain.contract.Contract;
import com.backend.domain.reviw.Review;
import com.backend.service.contract.ContractService;
import com.backend.service.review.ReviewService;
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
@RequestMapping("/api/review")
public class ReviewController {

    private final ReviewService service;
    private final ContractService contractService;

    @PostMapping
    public void insert(@RequestBody Review review) {
        service.insert(review);
    }

    @GetMapping("list")
    public Map<String,Object> list(@AuthId Integer memberId, Authentication authentication) {
        HashMap<String, Object> map = new HashMap<>();
        List<Contract> contractList = contractService.list(memberId, authentication);
        map.put("contractList", contractList);

        if(checkAuthority(authentication,"SCOPE_BOSS")){
            map.put("reviewList",service.listForBoss(memberId));
        } else if(checkAuthority(authentication,"SCOPE_ALBA")){
            map.put("reviewList",service.listForAlba(memberId));
        }
        System.out.println("map = " + map);
        return map;
    }

    @DeleteMapping("{jobsId}")
    public void delete(@PathVariable Integer jobsId,@AuthId Integer memberId) {
        service.delete(jobsId,memberId);
    }


private boolean checkAuthority(Authentication authentication, String authority) {
    return authentication.getAuthorities().stream()
            .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(authority));
}


}
