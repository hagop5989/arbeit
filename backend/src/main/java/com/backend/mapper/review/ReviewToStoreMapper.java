package com.backend.mapper.review;

import com.backend.domain.review.ReviewToAlba;
import com.backend.domain.reviw.ReviewToStore;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ReviewToStoreMapper {

    @Select("""
            //            SELECT * FROM review_to_store
            //            WHERE jobs_id
            //                      IN (SELECT jobs_id FROM jobs WHERE jobs.member_id = #{memberId})
            //            /* 사장은 자기 id를 jobs 에서 memberId와 비교하여, 자신이 올린 공고의 id를 받아와 보여줌 */
            //            """)
    List<ReviewToStore> listForBoss(Integer memberId);

    @Select("""
            SELECT rta.*,
               j.title AS jobsTitle
            FROM review_to_store rta
                JOIN jobs j ON j.store_id = rta.store_id
            WHERE rta.alba_id = #{albaId}
            /* 알바는 자신의 memberId 기반으로 받음 */
            """)
    List<ReviewToStore> listForAlba(Integer albaId);

    @Select("""
            SELECT * FROM review_to_store r
            JOIN contract c ON c.jobs_id = r.jobs_id
            WHERE authority = 'BOSS' AND c.alba_id = #{memberId}
            """)
        /* 알바id 기준 contract 테이블과 연결해서 review 가져옴 */
    List<ReviewToStore> listForAlba2(Integer memberId);


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

}
