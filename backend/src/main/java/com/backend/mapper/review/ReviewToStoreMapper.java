package com.backend.mapper.review;

import com.backend.domain.review.ReviewToAlba;
import com.backend.domain.review.ReviewToStore;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ReviewToStoreMapper {

    @Select("""
            SELECT rta.*, j.title AS jobsTitle
            FROM review_to_store rta
                JOIN jobs j ON j.store_id = rta.store_id
                JOIN contract c ON c.alba_id = rta.alba_id
                JOIN store s ON s.id = j.store_id
            WHERE rta.alba_id = #{albaId}
                AND rta.store_id IN (SELECT store_id FROM contract WHERE alba_id = #{albaId})
            GROUP BY rta.alba_id,rta.store_id;
            /* 알바는 자신의 memberId 기반으로 받음 */
            """)
    List<ReviewToStore> listForAlba(Integer albaId);

    @Select("""
            SELECT rta.*, j.title AS jobsTitle
            FROM review_to_alba rta
                JOIN jobs j ON j.member_id = rta.boss_id
                JOIN contract c ON c.jobs_id = j.id
            WHERE rta.alba_id = #{albaId}
                GROUP BY rta.alba_id,rta.boss_id;
            """)
        /* 가게의 알바 평가 가져오기(알바가 가진 id 기준) */
    List<ReviewToAlba> listToAlba(Integer albaId);


    @Insert("""
            INSERT INTO review_to_store
                (alba_id, store_id, content, rating)
            VALUES
                (#{albaId}, #{storeId},#{content},#{rating})
            """)
    int insert(ReviewToStore reviewToStore);

    @Delete("""
            DELETE FROM review_to_store
            WHERE store_id = #{storeId} AND alba_id = #{albaId}
            """)
    int delete(Integer storeId, Integer albaId);

    @Update("""
            UPDATE review_to_store
            SET content = #{content}, rating = #{rating}
            WHERE store_id = #{storeId} AND alba_id = #{albaId}
            """)
    int update(ReviewToStore reviewToStore);


}
