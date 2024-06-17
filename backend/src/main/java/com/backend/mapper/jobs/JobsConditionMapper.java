package com.backend.mapper.jobs;

import com.backend.domain.jobs.JobsCond;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface JobsConditionMapper {
    @Insert("""
            INSERT INTO jobs_condition
            (jobs_id, education,education_detail, age, preferred, work_period, work_week, work_time)
            VALUES
            (#{jobsId},#{education},#{educationDetail},#{age},#{preferred},#{workPeriod},#{workWeek},#{workTime});
            """)
    int insert(JobsCond jobsCond);

    @Select("""
            SELECT * FROM jobs_condition
            WHERE jobs_id = #{jobsId}
            """)
    JobsCond selectByJobsId(Integer jobsId);

    @Update("""
            UPDATE jobs_condition
            SET
            jobs_id = #{jobsId},
            education = #{education},
            education_detail = #{educationDetail},
            age = #{age},
            preferred = #{preferred},
            work_period = #{workPeriod},
            work_week = #{workWeek},
            work_time = #{workTime}
            WHERE jobs_id = #{jobsId}
            """)
    int updateByJobsId(JobsCond condition);

    @Delete("""
            DELETE FROM jobs_condition
            WHERE jobs_id = #{jobsId}
            """)
    int deleteByJobsId(Integer jobsId);

    @Select("""
            SELECT * FROM jobs_condition
            """)
    List<JobsCond> selectAll();

}
