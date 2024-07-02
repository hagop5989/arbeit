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

    public Map<String, Object> findAllByAuthId(Integer currentPage, String selectedType, Integer memberId) {
        
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> pageInfo = new HashMap<>();
        Integer offset = paging(currentPage, pageInfo, memberId);
        List<Application> applicationList = mapper.list(memberId, offset, selectedType);

        List<Application> list = applicationList.stream()
                .filter(application -> application.getResumeId() != null)
                .filter(application -> application.getJobsId() != null)
                .filter(application -> application.getMemberId() != null)
                .toList();

        result.put("applicationList", list);
        result.put("pageInfo", pageInfo);

        return result;
    }

    public Application findByJobsIdAndMemberId(Integer jobsId, Integer memberId) {
        return mapper.selectByJobsIdAndMemberId(jobsId, memberId);
    }

    public void update(Application application) {
        mapper.update(application);
    }


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

    // 페이징
    private Integer paging(Integer currentPage, Map<String, Object> pageInfo, Integer memberId) {
        Integer countAll = mapper.countAll(memberId);
        Integer itemPerPage = 8; // 페이지당 항목 수 지정
        Integer offset = (currentPage - 1) * itemPerPage;

        Integer lastPageNum = (int) Math.ceil((double) countAll / itemPerPage);
        Integer leftPageNum = (currentPage - 1) / 10 * 10 + 1;
        Integer rightPageNum = leftPageNum + 9;
        rightPageNum = Math.min(rightPageNum, lastPageNum);
        leftPageNum = rightPageNum - 9;
        leftPageNum = Math.max(leftPageNum, 1);
        Integer prevPageNum = leftPageNum - 1;
        Integer nextPageNum = rightPageNum + 1;

        //  이전,처음,다음,맨끝 버튼 만들기
        if (prevPageNum > 0) {
            pageInfo.put("prevPage", prevPageNum);
        }
        if (nextPageNum <= lastPageNum) {
            pageInfo.put("nextPage", nextPageNum);
        }

        pageInfo.put("currentPage", currentPage);
        pageInfo.put("lastPage", lastPageNum);
        pageInfo.put("leftPage", leftPageNum);
        pageInfo.put("rightPage", rightPageNum);

        return offset;

    }
}
