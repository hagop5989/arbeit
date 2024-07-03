package com.backend.mapper.scrap;

import com.backend.domain.scrap.Scrap;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ScrapMapper {
    @Insert("""
            INSERT INTO scrap(member_id,jobs_id, jobs_title, favorite)
            VALUES (#{memberId},#{jobsId},#{jobsTitle},#{favorite})
            """)
    int insert(Scrap scarp);

    @Select("""
            SELECT s.*,
                j.deadline AS deadline
            FROM scrap s
            JOIN jobs j ON j.id = s.jobs_id
            WHERE s.member_id = #{memberId}
            """)
    List<Scrap> selectByMemberId(Integer memberId);


    @Delete("""
            DELETE FROM scrap
            WHERE id = #{id}
            """)
    int delete(Integer id);


    @Delete("""
            DELETE FROM scrap
            WHERE jobs_id = #{jobsId}
            """)
    int deleteByJobsId(Integer jobsId);

    @Update("""
            UPDATE scrap
            SET favorite = #{favorite}
            WHERE member_id = #{memberId} AND jobs_id = #{jobsId}
            """)
    int update(Scrap scarp);

    @Select("""
            SELECT jobs_id,COUNT(id) AS jobsFavoriteCount FROM scrap
            WHERE favorite = 1 GROUP BY jobs_id;
                        """)
    List<Scrap> selectAll();


    @Select("""
            SELECT COUNT(*)
            FROM scrap s
            WHERE s.member_id = #{memberId} AND s.favorite = 1;
            """)
    Integer count(Integer memberId);

}
