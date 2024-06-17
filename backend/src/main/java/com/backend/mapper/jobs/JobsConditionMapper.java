package com.backend.mapper.jobs;

import com.backend.domain.jobs.JobsCondition;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface JobsConditionMapper {
    @Insert("""
            INSERT INTO jobs_condition
            (jobs_id, education,education_detail, age, preferred, work_period, work_week, work_time)
            VALUES
            (#{albaPostsId},#{education},#{educationDetail},#{age},#{preferred},#{workPeriod},#{workWeek},#{workTime});
            """)
    int insert(JobsCondition jobsCondition);

    @Select("""
            SELECT * FROM jobs_condition
            WHERE jobs_id = #{jobsId}
            """)
    JobsCondition selectByJobsId(Integer jobsId);

    @Update("""
            UPDATE jobs_condition
            SET
            education = #{education},
            education_detail = #{educationDetail},
            age = #{age},
            preferred = #{preferred},
            work_period = #{workPeriod},
            work_week = #{workWeek},
            work_time = #{workTime}
            WHERE jobs_id = #{albaPostsId}
            """)
    int update(JobsCondition condition);

    @Delete("""
            DELETE FROM jobs_condition
            WHERE jobs_id = #{jobsId}
            """)
    int deleteByJobsId(Integer jobsId);

    @Select("""
            SELECT * FROM jobs_condition
            """)
    List<JobsCondition> selectAll();

}
