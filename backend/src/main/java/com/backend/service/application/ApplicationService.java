package com.backend.service.application;

import com.backend.domain.application.Application;
import com.backend.domain.application.ApplicationWriteForm;
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

    public Map<String, Object> findResumesAndJobsTitle(Integer jobsId, Integer authId) {
        Map<String, Object> result = new HashMap<>();

        List<Resume> resumes = mapper.selectResumeByMemberId(authId);
        String jobsTitle = mapper.selectJobsTitleByJobsId(jobsId);

        result.put("resumes", resumes);
        result.put("jobsTitle", jobsTitle);

        return result;
    }

    public void write(ApplicationWriteForm form, Integer authId) {
        Application application = new Application(
                form.getJobsId(),
                authId,
                form.getResumeId(),
                form.getTitle(),
                form.getComment(),
                null, null, null
        );
        mapper.insert(application);
    }

    public List<Application> findAllByAuthId(Integer memberId) {
        return mapper.list(memberId);
    }

    public Application findByJobsIdAndMemberId(Integer jobsId, Integer memberId) {
        return mapper.selectByJobsIdAndMemberId(jobsId, memberId);
    }

    public void update(Application application) {
        mapper.update(application);
    }

    public void cancel(Integer jobsId, Integer authId) {
        mapper.deleteByJobsIdAndMemberId(jobsId, authId);
    }

    public void deleteAllByJobsId(Integer jobsId) {
        // 사장이 공고를 삭제하는 경우 해당공고의 알바 지원내역 모두 삭제
        mapper.deleteAllByJobsId(jobsId);
    }

    public boolean duplicationValidate(Integer jobsId, Integer authId) {
        Application application = mapper.selectByJobsIdAndMemberId(jobsId, authId);
        return application == null;
    }

    public Integer count(Integer authId) {
        return mapper.selectCountByMemberId(authId);
    }
}
