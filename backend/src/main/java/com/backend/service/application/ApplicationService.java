package com.backend.service.application;

import com.backend.domain.application.Application;
import com.backend.domain.application.ApplicationWriteForm;
import com.backend.domain.resume.Resume;
import com.backend.mapper.application.ApplicationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    public void write(ApplicationWriteForm form, Integer jobsId, Integer authId) {
        Application application = new Application(
                jobsId,
                authId,
                form.getResumeId(),
                form.getTitle(),
                form.getComment(),
                null, null, null
        );
        mapper.insert(application);
    }

    public List<Application> findAllByAuthId(Integer memberId) {
        List<Application> applicationList = mapper.list(memberId);
        return applicationList.stream()
                .filter(application -> application.getResumeId() != null)
                .filter(application -> application.getJobsId() != null)
                .filter(application -> application.getMemberId() != null)
                .toList();
    }

    public Application findByJobsIdAndMemberId(Integer jobsId, Integer memberId) {
        return mapper.selectByJobsIdAndMemberId(jobsId, memberId);
    }

    public void update(Application application) {
        mapper.update(application);
    }


    // TODO : 반환 타입 고쳐야함
    public ResponseEntity cancel(Integer jobsId, Integer authId) {
        Application application = mapper.selectByJobsIdAndMemberId(jobsId, authId);
        Integer isPassed = application.getIsPassed();
        if (isPassed != null) {
            if (isPassed == 1) {
                return ResponseEntity.badRequest().body("합격 처리된 지원서는 취소할 수 없습니다.");
            }
        }
        mapper.deleteByJobsIdAndMemberId(jobsId, authId);
        return ResponseEntity.ok().build();
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
        Integer count = mapper.selectCountByMemberId(authId);

        return count;
    }


}
