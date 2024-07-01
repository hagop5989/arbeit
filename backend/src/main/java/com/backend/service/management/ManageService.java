package com.backend.service.management;

import com.backend.domain.application.Contract;
import com.backend.domain.management.AlbaScore;
import com.backend.mapper.management.ManageMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(rollbackFor = Exception.class)
public class ManageService {

    private final ManageMapper mapper;

    public List<Map<String, Object>> findApplications(Integer authId, Integer currentPage) {
        Map<String, Object> pageInfo = new HashMap<>();
        Integer offset = paging(currentPage, pageInfo, authId);
        System.out.println("pageInfo = " + pageInfo);
        System.out.println("offset = " + offset);

        // 이름이 탈퇴한 유저 제외 하고 받아옴.
        List<Map<String, Object>> applications = mapper.selectApplicationsByAuthId(authId, offset);
        List<Map<String, Object>> mapList = new java.util.ArrayList<>(applications.stream()
                .filter(application -> application.get("resumeId") != null)
                .peek(ManageService::getFormatInserted)
                .toList());
        mapList.add(pageInfo);

        return mapList;
    }

    private static void getFormatInserted(Map<String, Object> application) {
        Timestamp inserted = (Timestamp) application.get("inserted");
        String updateInserted = inserted.toLocalDateTime()
                .format(DateTimeFormatter.ofPattern("yy.MM.dd"));
        application.put("inserted", updateInserted);
    }

    public Map<String, Object> findApplicationByJobsIdAndAlbaId(Integer jobsId, Integer albaId) {
        return mapper.selectApplicationByJobsIdAndAlbaId(jobsId, albaId);
    }

    public String reject(Integer jobsId, Integer albaId) {
        int rejected = mapper.updateRejectByJobsIdAndAlbaId(jobsId, albaId);
        if (rejected < 1) {
            return "이미 처리되어있는 상태입니다.";
        }
        return null;
    }

    public String pass(Contract contract, Integer authId) {
        if (contract.getStartDate().after(contract.getEndDate())) {
            return "근무 시작일이 종료일보다 클 수 없습니다.";
        }
        contract.setBossId(authId);
        int canPass = mapper.updatePassByJobsIdAndAlbaId(contract);
        if (canPass < 1) {
            return "이미 처리되어있는 상태입니다.";
        } else {
            mapper.insertContract(contract);
            return null;
        }
    }

    public List<Map<String, Object>> findAlbaList(Integer authId) {
        List<Map<String, Object>> albaList = mapper.selectAlbaList(authId);
        System.out.println("albaList = " + albaList);

        List<Map<String, Object>> mapList = albaList.stream()
                .filter(alba -> !alba.get("albaName").equals("탈퇴한 유저")) // "탈퇴한 유저" 와 일치하지 않는 것만 추출
                .filter(alba -> alba.get("albaReview") == null) // 알바 리뷰가 null 인 것만 추출
                .toList();
        return mapList;

    }

    public void reviewToAlba(AlbaScore score, Integer authId) {
        score.setBossId(authId);
        mapper.insertReviewToAlba(score);
    }

    public Integer count(Integer memberId) {
        return mapper.count(memberId);
    }

    // 페이징
    private Integer paging(Integer currentPage, Map<String, Object> pageInfo, Integer authId) {
        System.out.println("currentPage = " + currentPage);
        Integer countAll = mapper.countAll(authId);
        System.out.println("countAll = " + countAll);
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
