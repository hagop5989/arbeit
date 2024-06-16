package com.backend.mapper.management;

import com.backend.domain.application.Application;
import com.backend.domain.management.Management;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ManagementMapper {


    @Select("""
    SELECT ma.*,
       j.title AS jobsTitle,
       a.member_id AS appliedMemberId,
       a.title AS applicationTitle,
       a.inserted AS applicationInserted
       FROM management ma
       JOIN jobs j ON  j.id = ma.jobs_id
       JOIN application a ON a.jobs_id = j.id
       WHERE j.member_id = #{memberId}
        """)
    List<Management> list(Integer memberId);


    @Insert("""
    INSERT INTO management (jobs_id, applied_member_id,resume_id,is_passed)
    VALUES (#{jobsId},#{memberId},#{resumeId},#{isPassed})
    """)
    int insert(Application application);


    @Select("""
    SELECT a.*,
       j.title AS jobsTitle
    FROM application a
    JOIN jobs j ON j.id = a.jobs_id
    WHERE  a.jobs_id = #{jobsId}
    AND a.member_id
        = (SELECT r.member_id  FROM resume r WHERE r.id = #{resumeId} )
    """)
    Application selectByResumeIdAndJobs(Integer jobsId, Integer resumeId);


    @Update("""
    UPDATE management 
    SET is_passed = #{isPassed}
    WHERE jobs_id = #{jobsId} AND applied_member_id = #{appliedMemberId}
    """)
    int insertPassOrNot(Management management);

    @Delete("""
    DELETE FROM management
    WHERE jobs_id = #{jobsId} AND applied_member_id = #{appliedMemberId}
    """)
    int delete(Integer jobsId, Integer appliedMemberId);

}
