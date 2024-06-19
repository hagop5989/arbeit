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
            SELECT * FROM scrap
            WHERE member_id = #{memberId}
            """)
    List<Scrap> selectByMemberId(Integer memberId);


    @Delete("""
            DELETE FROM scrap
            WHERE id = #{id}
            """)
    int delete(Integer id);

    @Update("""
            UPDATE scrap
            SET favorite = #{favorite}
            WHERE member_id = #{memberId} AND jobs_id = #{jobsId}
            """)
    int update(Scrap scarp);

}
