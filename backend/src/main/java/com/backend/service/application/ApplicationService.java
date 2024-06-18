package com.backend.service.application;

import com.backend.domain.application.Application;
import com.backend.domain.jobs.Jobs;
import com.backend.domain.member.resume.Resume;
import com.backend.mapper.application.ApplicationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationMapper mapper;

    public Map<String, Object> load(Integer jobsId, Integer memberId) {
        Map<String, Object> loadData = new HashMap<>();

        List<Resume> resumes = mapper.selectResumeByMemberId(memberId);
        Jobs jobs = mapper.selectJobsByJobsId(jobsId);

        loadData.put("resumes", resumes);
        loadData.put("jobsTitle", jobs.getTitle());

        return loadData;
    }

    public void insert(Application application) {
        mapper.insert(application);
    }

    public Application select(Integer jobsId, Integer memberId) {
        return mapper.selectByJobsIdAndMemberId(jobsId, memberId);
    }

    public void update(Application application) {
        mapper.update(application);
    }


    public List<Application> list(Integer memberId) {
        return mapper.list(memberId);
    }

    public void delete(Integer jobsId, Integer memberId) {
        mapper.deleteByJobsIdAndMemberId(jobsId, memberId);
    }


    public Map<String, Object> getUpdateData(Integer memberId, Integer jobsId) {
        Map<String, Object> loadData = new HashMap<>();
        List<Resume> resumes = mapper.selectResumeByMemberId(memberId);
        Application application = mapper.selectByJobsIdAndMemberId(jobsId, memberId);

        loadData.put("application", application);
        loadData.put("resumes", resumes);

        return loadData;
    }

    public void deleteAllByJobsId(Integer jobsId) {
        // 사장이 공고를 삭제하는 경우 해당공고의 알바 지원내역 모두 삭제
        mapper.deleteAllByJobsId(jobsId);
    }
}
