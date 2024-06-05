package com.backend.service.jobs;

import com.backend.domain.jobs.Jobs;
import com.backend.mapper.jobs.JobsMapper;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class JobsService {
    private final JobsMapper jobsMapper;
    private final MemberMapper memberMapper;

    public void insert(Jobs jobs) {
        jobsMapper.insert(jobs);
    }

    public void update(Jobs jobs) {
        jobsMapper.update(jobs);
    }

    public Jobs selectByJobsId(Integer jobsId) {
        return jobsMapper.selectByJobsId(jobsId);

    }

    public void deleteByJobsId(Integer jobsId) {
        jobsMapper.deleteByJobsId(jobsId);
    }

    public Map<String, Object> list(Integer memberId, Integer page,
                                    String searchType, String keyword) {
        Map pageInfo = new HashMap();
        Integer countAll = jobsMapper.countAllWithSearch(searchType, keyword);

        Integer offset = (page - 1) * 10;

        Integer lastPageNum = (countAll - 1) / 10 + 1;
        Integer leftPageNum = (page - 1) / 10 * 10 + 1;
        Integer rightPageNum = leftPageNum + 9;
        rightPageNum = Math.min(rightPageNum, lastPageNum);
        leftPageNum = rightPageNum - 9;
        leftPageNum = Math.max(leftPageNum, 1);
        Integer prevPageNum = leftPageNum - 1;
        Integer nextPageNum = rightPageNum + 1;

        //  이전,처음,다음,맨끝 버튼 만들기
        if (prevPageNum > 0) {
            pageInfo.put("prevPageNum", prevPageNum);
        }
        if (nextPageNum <= lastPageNum) {
            pageInfo.put("nextPageNum", nextPageNum);
        }
        pageInfo.put("currentPageNum", page);
        pageInfo.put("lastPageNum", lastPageNum);
        pageInfo.put("leftPageNum", leftPageNum);
        pageInfo.put("rightPageNum", rightPageNum);
        List<Jobs> JobsBoardList = jobsMapper.selectAllPaging(offset, searchType, keyword);

        return Map.of("pageInfo", pageInfo,
                "jobsList", JobsBoardList);
    }
}

