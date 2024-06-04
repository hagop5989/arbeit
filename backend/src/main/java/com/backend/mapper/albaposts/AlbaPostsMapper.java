package com.backend.mapper.albaposts;

import com.backend.domain.albaposts.AlbaPosts;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AlbaPostsMapper {
    @Insert("""
            INSERT INTO alba_posts( title, content, store_name,boss_name, store_id, boss_id)
            VALUES(#{title}, #{content}, #{storeName},#{boss_name}, #{storeId}, #{bossId})
            """)
    int insert(AlbaPosts albaPosts);

    @Update("""
            UPDATE alba_posts SET
            title = #{title},
            content = #{content},
            store_name = #{storeName},
            store_id = #{storeId},
            boss_id = #{bossId}
            WHERE id = #{id}
            """)
    int update(AlbaPosts albaPosts);

    @Select("""
            SELECT * FROM alba_posts
            WHERE id = #{id}
            """)
    AlbaPosts selectByPostId(Integer id);

    @Select("""
            SELECT * FROM alba_posts
            WHERE boss_id = #{bossId}
            """)
    List<AlbaPosts> findAllByBossId(Integer bossId);

    @Delete("""
            DELETE FROM alba_posts
            WHERE id=#{id}
            """)
    int deleteByPostId(Integer id);

}
