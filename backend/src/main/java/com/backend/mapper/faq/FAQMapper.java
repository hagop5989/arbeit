package com.backend.mapper.faq;

import com.backend.domain.faq.FAQ;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FAQMapper {

    @Select("""
            SELECT id, question, answer
            FROM Wfaq
            ORDER BY id
            """)
    List<FAQ> WQNA();

    @Select("""
            SELECT id, question, answer
            FROM Bfaq
            ORDER BY id
            """)
    List<FAQ> BQNA();

    @Insert("""
            INSERT INTO Wfaq (question, answer)
            VALUES (#{question}, #{answer})
            """)
    int addQnAw(FAQ faq);

    @Insert("""
            INSERT INTO Bfaq (question, answer)
            VALUES (#{question}, #{answer})
            """)
    int addQnAb(FAQ faq);


    @Update("""
            UPDATE Wfaq
            SET question = #{question}, answer = #{answer}
            WHERE id = #{id}
            """)
    int updateQnAW(FAQ faq);

    @Update("""
            UPDATE Bfaq
            SET question = #{question}, answer = #{answer}
            WHERE id = #{id}
            """)
    int updateQnAB(FAQ faq);

    @Delete("""
            DELETE FROM Wfaq
            WHERE id = #{id}
            """)
    int deleteW(Integer id);

    @Delete("""
            DELETE FROM Bfaq
            WHERE id = #{id}
            """)
    int deleteB(Integer id);
}
