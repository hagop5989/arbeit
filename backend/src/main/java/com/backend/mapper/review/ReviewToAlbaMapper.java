package com.backend.mapper.review;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ReviewToAlbaMapper {
    @Select("""
            SELECT rating
            FROM review_to_alba
            WHERE alba_id=#{albaId}
            """)
    List<Integer> selectScoreByAlbaId(Integer albaId);
}


