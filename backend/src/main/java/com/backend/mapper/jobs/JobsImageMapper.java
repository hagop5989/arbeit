package com.backend.mapper.jobs;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface JobsImageMapper {

    @Insert("""
            INSERT INTO jobs_image (jobs_id, name)
            VALUES (#{jobsId},#{name})
            ON DUPLICATE KEY UPDATE name = VALUES(name);
            """)
    int insertImage(Integer jobsId, String name);

    @Select("""
            SELECT name
            FROM jobs_image
            WHERE jobs_id = #{jobsId}
            """)
    List<String> selectImageNameByJobsId(Integer jobsId);

    @Delete("""
            DELETE FROM jobs_image
            WHERE jobs_id = #{jobsId}
            AND name = #{imageName}
            """)
    int deleteByJobsIdAndImageName(Integer jobsId, String imageName);

    @Delete("""
            DELETE FROM jobs_image
            WHERE jobs_id=#{jobsId}
            """)
    int deleteByJobsId(Integer jobsId);


}
