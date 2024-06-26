package com.backend.service.management;

import com.backend.domain.application.Application;
import com.backend.domain.management.Management;
import com.backend.mapper.management.ManagementMapper;
import com.backend.service.contract.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ManagementService {
    private final ManagementMapper mapper;
    private final ContractService contractService;

    public Map<String, Object> list(Integer bossId, Integer currentPage) {
        Map<String, Integer> pageInfo = new HashMap<>();
        Integer offset = paging(currentPage, pageInfo, bossId);
        List<Management> managementList = mapper.selectAllPaging(bossId, offset);

        return Map.of("pageInfo", pageInfo,
                "managementList", managementList);
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


    private Integer paging(Integer currentPage, Map<String, Integer> pageInfo, Integer bossId) {

        Integer countAll = mapper.countAll(bossId);
        Integer itemPerPage = 8; // 페이지당 항목 수 지정
        Integer offset = (currentPage - 1) * itemPerPage;

        Integer lastPageNum = (countAll + itemPerPage - 1) / itemPerPage;
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
