package com.backend.mapper.management;

import com.backend.domain.application.Contract;
import com.backend.domain.management.AlbaScore;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

@Mapper
public interface ManageMapper {

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

    // jobsId 찾아서 jobsId의 application 에서 memberId찾아서 memberId로 member의 이름 찾기
    // 직원 이름, 일하는 지점
    @Select("""
            SELECT DISTINCT m.id   albaId,
                            m.name albaName,
                            m.phone albaPhone,
                            s.name storeName,
                            ra.alba_id albaReview
            FROM jobs j
                     JOIN application a ON j.id = a.jobs_id
                     JOIN member m ON a.member_id = m.id
                     JOIN store s ON j.store_id = s.id
                     LEFT JOIN review_to_alba ra ON ra.alba_id = m.id
            WHERE j.member_id = #{authId};
            """)
    List<Map<String, Object>> selectAlbaList(Integer authId);

    @Insert("""
            INSERT INTO review_to_alba (alba_id, boss_id, rating)
            VALUES (#{albaId}, #{bossId}, #{albaScore})
            """)
    void insertReviewToAlba(AlbaScore score);
}
