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
            <script>
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
            JOIN store s ON s.id = j.store_id
            JOIN resume r ON r.id = a.resume_id
            JOIN member m ON a.member_id = m.id
            WHERE j.member_id= #{authId} AND m.name != '탈퇴한 유저'
            <if test="selectedType != null">
               <choose>
                   <when test="selectedType == '합격'">
                   AND a.is_passed = 1
                   </when>
                   <when test="selectedType == '불합격'">
                   AND a.is_passed = 0
                   </when>
                   <when test="selectedType == '미정'">
                    AND a.is_passed IS NULL
               </when>
               </choose>
            </if>
            ORDER BY a.inserted DESC
            LIMIT #{offset},8;
            </script>
            """)
    List<Map<String, Object>> selectApplicationsByAuthId(Integer authId, Integer offset, String selectedType);

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
                            j.id jobsId,
                            ra.alba_id albaReview,
                            c.start_date startDate,
                            c.end_date endDate
            FROM jobs j
                     JOIN application a ON j.id = a.jobs_id
                     JOIN member m ON a.member_id = m.id
                     JOIN contract c ON c.boss_id = j.member_id AND c.jobs_id = j.id AND c.alba_id = a.member_id
                     JOIN store s ON j.store_id = s.id
                     LEFT JOIN review_to_alba ra ON ra.alba_id = m.id AND ra.boss_id = #{authId} AND ra.jobs_id = j.id
            WHERE j.member_id = #{authId} AND a.is_passed = 1;
            """)
    List<Map<String, Object>> selectAlbaList(Integer authId);

    @Insert("""
            INSERT INTO review_to_alba (alba_id, boss_id, jobs_id, rating)
            VALUES (#{albaId}, #{bossId},#{jobsId}, #{albaScore})
            """)
    int insertReviewToAlba(AlbaScore score);

    @Select("""
            SELECT count(*)
            FROM application a
            JOIN member m ON m.id = a.member_id
            JOIN resume r ON r.id = a.resume_id
            WHERE is_passed IS NULL
            AND a.jobs_id
            IN (SELECT j.id FROM jobs j WHERE j.member_id = #{memberId});
            """)
    Integer count(Integer memberId);

    @Select("""
            <script>
            SELECT COUNT(*)
            FROM application a
            JOIN member m ON m.id = a.member_id
            JOIN resume r ON r.id = a.resume_id
            JOIN jobs j ON j.id = a.jobs_id
            JOIN store s ON s.id = j.store_id
            WHERE m.name != '탈퇴한 유저'
              AND a.jobs_id
              IN (SELECT j.id FROM jobs j WHERE j.member_id = #{bossId})
            <if test="selectedType != null">
               <choose>
                   <when test="selectedType == '합격'">
                   AND a.is_passed = 1
                   </when>
                   <when test="selectedType == '불합격'">
                   AND a.is_passed = 0
                   </when>
                   <when test="selectedType == '미정'">
                    AND a.is_passed IS NULL
               </when>
               </choose>
            </if>
            </script>
            """)
    Integer countAllWithSearch(Integer bossId, String selectedType);
}
