package com.backend.mapper.review;

import com.backend.domain.review.ReviewToAlba;
import com.backend.domain.reviw.ReviewToStore;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ReviewToAlbaMapper {


    @Insert("""
            INSERT INTO review_to_alba
            (alba_id, boss_id, content, rating)
            VALUES
            (#{albaId},#{bossId},#{content},#{rating})
            """)
    int insert(ReviewToAlba review);


    @Select("""
            SELECT * FROM review_to_alba
            WHERE boss_id = #{bossId}
            """)
    List<ReviewToAlba> list(Integer bossId);

    @Delete("""
            DELETE FROM review_to_alba
            WHERE alba_id = #{albaId} AND boss_id = #{bossId}
            """)
    int delete(Integer albaId, Integer bossId);

    @Update("""
            UPDATE review_to_alba 
            SET content = #{content} , rating = #{rating}
            WHERE alba_id = #{albaId} AND boss_id = #{bossId}
            """)
    int update(ReviewToAlba review);

    @Select("""
            SELECT rts.*,
                   j.title AS jobsTitle
            FROM review_to_store rts
            JOIN jobs j ON j.store_id = rts.store_id 
            WHERE rts.store_id
              IN (SELECT id FROM store WHERE store.member_id = #{bossId})
            """)
        /* 알바의 가게 평가 가져오기(boss가 가진 store id 기준) */
    List<ReviewToStore> listToStore(Integer bossId);

}
