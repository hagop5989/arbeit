package com.backend.service.contract;

import com.backend.domain.contract.Contract;
import com.backend.domain.management.Management;
import com.backend.mapper.contract.ContractMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ContractService {
    private final ContractMapper mapper;

    public void insert(Contract contract) {
        mapper.insert(contract);

    }

    public void deleteByIds(Management management) {
        // 불합격 처리인경우 boss,alba,jobs Id를 사용하여 기존 생성된 contract 있다면 삭제.
        if (mapper.selectByIds(management) != null) {
            mapper.deleteByIds(management);
        }
    }

    public List<Contract> list(Integer memberId, Authentication authentication) {

        if (checkAuthority(authentication, "SCOPE_BOSS")) {
            return mapper.listForBoss(memberId);
        } else if (checkAuthority(authentication, "SCOPE_ALBA")) {
            return mapper.listForAlba(memberId);
        }
        return null;
    }


    private boolean checkAuthority(Authentication authentication, String authority) {
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(authority));
    }
}
