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

    public List<Management> list( Integer memberId) {
        return mapper.list(memberId);

    }

    public void insert(Application application) {
        mapper.insert(application);

    }

    public Application select(Integer jobsId, Integer resumeId) {
        return mapper.selectByResumeIdAndJobs(jobsId, resumeId);

    }

    public void insertPassOrNot(Management management) {
        int i = mapper.insertPassOrNot(management);
        System.out.println("i = " + i);
    }

    public void delete(Integer jobsId, Integer memberId) {
        mapper.delete(jobsId,memberId);
    }
}
