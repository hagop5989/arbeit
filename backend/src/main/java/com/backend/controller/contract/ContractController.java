package com.backend.controller.contract;

import com.backend.controller.application.AuthId;
import com.backend.domain.contract.Contract;
import com.backend.service.contract.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/contract")
public class ContractController {
    private final ContractService service;

    @PostMapping("")
    public void insert(@RequestBody Contract contract) {
        service.insert(contract);

    }

    @GetMapping("list")
    public List<Contract> list(@AuthId Integer memberId, Authentication authentication) {
        List<Contract> list = service.list(memberId, authentication);
        return list;
    }

    public void update() {
    }

    public void delete() {
    }


}
