package com.backend.service.albaposts;

import com.backend.domain.albaposts.Jobs;
import com.backend.mapper.albaposts.JobsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class JobsService {
    private final JobsMapper mapper;

    public void insert(Jobs jobs) {
        mapper.insert(jobs);
    }

    public void update(Jobs jobs) {
        mapper.update(jobs);
    }

    public Jobs selectByJobsId(Integer jobsId) {
        return mapper.selectByJobsId(jobsId);
    }

    public List<Jobs> findAllByBossId(Integer bossId) {
        return mapper.findAllByBossId(bossId);
    }

    public void deleteByJobsId(Integer jobsId) {
        mapper.deleteByJobsId(jobsId);
    }
}
