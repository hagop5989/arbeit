package com.backend.mapper.jobs;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface JobsFileMapper {

    @Insert("""
            INSERT INTO jobs_file (jobs_id, name)
            VALUES (#{jobsId},#{name})
            """)
    int insertFileName(Integer jobsId, String name);

    @Select("""
            SELECT name 
            FROM jobs_file 
            WHERE jobs_id = #{jobsId}
            """)
    List<String> selectFileNameByJobsId(Integer jobsId);

    @Delete("""
            DELETE FROM jobs_file
            WHERE jobs_id = #{jobsId}
            AND name = #{fileName}
            """)
    int deleteFileByJobsIdAndName(Integer jobsId, String fileName);


}
