package com.backend.mapper.review;

import com.backend.domain.reviw.Review;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ReviewMapper {

    @Select("""
            SELECT * FROM review
            WHERE jobs_id
                      IN (SELECT jobs_id FROM jobs WHERE jobs.member_id = #{memberId})
            /* 사장은 자기 id를 jobs 에서 memberId와 비교하여, 자신이 올린 공고의 id를 받아와 보여줌 */
            """)
    List<Review> listForBoss(Integer memberId);

    @Select("""
            SELECT * FROM review
            WHERE member_id = #{memberId}
            /* 알바는 자신의 memberId 기반으로 받음 */
            """)
    List<Review> listForAlba(Integer memberId);


    @Insert("""
            INSERT INTO review
                (member_id, jobs_id, jobs_title, content, rating)
            VALUES
                (#{memberId}, #{jobsId},#{jobsTitle},#{content},#{rating})
            """)
    int insert(Review review);

    @Delete("""
            DELETE FROM review
            WHERE jobs_id = #{jobsId} AND member_id = #{memberId}
            """)
    int delete(Integer jobsId, Integer memberId);

    @Update("""
            UPDATE review
            SET content = #{content}, rating = #{rating}
            WHERE jobs_id = #{jobsId} AND member_id = #{memberId}
            """)
    int update(Review review);

}
