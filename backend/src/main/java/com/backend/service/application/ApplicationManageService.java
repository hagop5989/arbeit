package com.backend.service.application;

import com.backend.domain.application.Contract;
import com.backend.mapper.application.ApplicationManageMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(rollbackFor = Exception.class)
public class ApplicationManageService {

    private final ApplicationManageMapper mapper;

    public List<Map<String, Object>> findApplications(Integer authId) {

        List<Map<String, Object>> applications = mapper.selectApplicationsByAuthId(authId);

        return applications.stream()
                .filter(application -> application.get("resumeId") != null)
                .peek(ApplicationManageService::getFormatInserted)
                .toList();
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
}
