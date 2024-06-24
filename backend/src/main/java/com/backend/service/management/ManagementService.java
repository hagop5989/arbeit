package com.backend.service.management;

import com.backend.domain.application.Application;
import com.backend.domain.management.Management;
import com.backend.mapper.management.ManagementMapper;
import com.backend.service.contract.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ManagementService {
    private final ManagementMapper mapper;
    private final ContractService contractService;

    public List<Management> list(Integer memberId) {
        return mapper.list(memberId);
    }

    public Application select(Integer jobsId, Integer resumeId) {
        return mapper.selectByResumeIdAndJobs(jobsId, resumeId);
    }

    public void updateDecision(Management management) {
        if (management != null && management.getIsPassed() == 0) {
            // 불합격 처리인경우 boss,alba,jobs Id를 사용하여 기존 생성된 contract 있다면 삭제.
            contractService.deleteByIds(management);
        }
        mapper.updateDecision(management);
    }

    public Integer count(Integer memberId) {
        // 합격 여부가 미정인 것 count
        return mapper.alarmCount(memberId);
    }
}
