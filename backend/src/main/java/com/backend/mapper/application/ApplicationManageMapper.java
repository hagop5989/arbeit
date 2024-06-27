package com.backend.mapper.application;

import com.backend.domain.application.Contract;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

@Mapper
public interface ApplicationManageMapper {

    @Select("""
            SELECT
                j.title jobsTitle,
                a.jobs_id jobsId,
                a.member_id albaId,
                m.name albaName,
                a.resume_id resumeId,
                a.inserted,
                a.is_passed isPassed
            FROM application a
              JOIN jobs j ON a.jobs_id = j.id
              JOIN member m ON j.member_id = m.id
            WHERE m.id=#{authId}
            """)
    List<Map<String, Object>> selectApplicationsByAuthId(Integer authId);

    @Select("""
            SELECT
                j.title jobsTitle,
                m.name,
                m.phone,
                m.email,
                a.resume_id resumeId,
                a.comment,
                a.is_passed isPassed
            FROM application a
            JOIN jobs j ON a.jobs_id = j.id
            JOIN member m ON a.member_id = m.id
            WHERE a.jobs_id=#{jobsId} AND a.member_id=#{albaId}
            """)
    Map<String, Object> selectApplicationByJobsIdAndAlbaId(Integer jobsId, Integer albaId);

    @Update("""
            UPDATE application
            SET is_passed=false
            WHERE jobs_id=#{jobsId} AND member_id=#{albaId} AND is_passed IS NULL
            """)
    int updateRejectByJobsIdAndAlbaId(Integer jobsId, Integer albaId);

    @Update("""
            UPDATE application
            SET is_passed=true
            WHERE jobs_id=#{jobsId} AND member_id=#{albaId} AND is_passed IS NULL
            """)
    int updatePassByJobsIdAndAlbaId(Contract contract);

    @Insert("""
            INSERT INTO contract (boss_id, alba_id, jobs_id, start_date, end_date)
            VALUES (#{bossId}, #{albaId}, #{jobsId}, #{startDate}, #{endDate})
            """)
    void insertContract(Contract contract);
}
