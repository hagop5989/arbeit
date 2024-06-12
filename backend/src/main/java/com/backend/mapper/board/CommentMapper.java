package com.backend.mapper.board;

import com.backend.domain.board.Comment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentMapper {
    @Insert("""
            INSERT INTO comment
            (member_id,comment)
            VALUES (#{memberId},#{comment})
            """)
    int insert(Comment comment);

    @Select("""
                    SELECT c.id, c.member_id, m.name, comment, c.inserted
                    FROM comment c JOIN member m ON m.id =c.member_id
                    WHERE board_id = #{boardId}
                    ORDER BY id DESC
            """)
    List<Comment> selectAll(Integer boardId);


    @Select("""
                    SELECT c.id, m.name, c.member_id, c.inserted, comment
                    FROM comment c JOIN member m ON m.id=c.member_id
                    WHERE c.id=#{id}
            """)
    Comment selectById(Integer id);

    @Delete("""
                DELETE FROM comment
                WHERE member_id=#{memberId}
            """)
    int deleteById(Integer memberid);

    @Update("""
                UPDATE comment
                            SET comment=#{comment}
                            WHERE id =#{id};
            """)
    int update(Comment comment);
}
