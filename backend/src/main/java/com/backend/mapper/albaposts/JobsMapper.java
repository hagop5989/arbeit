package com.backend.mapper.albaposts;

import com.backend.domain.albaposts.Jobs;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface JobsMapper {
    @Insert("""
            INSERT INTO alba_posts( title, content, store_name, store_id, boss_id)
            VALUES(#{title}, #{content}, #{storeName}, #{storeId}, #{bossId})
            """)
    int insert(Jobs jobs);

    @Update("""
            UPDATE alba_posts SET
            title = #{title},
            content = #{content},
            store_name = #{storeName},
            store_id = #{storeId},
            boss_id = #{bossId}
            WHERE id = #{id}
            """)
    int update(Jobs jobs);

    @Select("""
            SELECT * FROM alba_posts
            WHERE id = #{id}
            """)
    Jobs selectByJobsId(Integer id);

    @Select("""
            SELECT ap.id, ap.title, ap.store_name, b.name AS bossName
            FROM alba_posts ap
            JOIN boss b ON ap.boss_id = b.id
            WHERE b.id = #{id}
            """)
    List<Jobs> findAllByBossId(Integer bossId);

    @Delete("""
            DELETE FROM alba_posts
            WHERE id=#{id}
            """)
    int deleteByJobsId(Integer id);

}
