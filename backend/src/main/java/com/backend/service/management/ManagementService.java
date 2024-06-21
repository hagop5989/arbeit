package com.backend.service.management;

import com.backend.domain.application.Application;
import com.backend.domain.management.Management;
import com.backend.mapper.management.ManagementMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ManagementService {
    private final ManagementMapper mapper;

    public List<Management> list(Integer memberId) {
        return mapper.list(memberId);
    }

    public Application select(Integer jobsId, Integer resumeId) {
        return mapper.selectByResumeIdAndJobs(jobsId, resumeId);
    }

    public void insertDecision(Management management) {
        mapper.insertDecision(management);
    }

    public Integer count(Integer memberId) {
        // 합격 여부가 미정인 것 count
        return mapper.alarmCount(memberId);
    }
}
