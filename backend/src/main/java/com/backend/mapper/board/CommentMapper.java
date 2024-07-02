package com.backend.mapper.board;

import com.backend.domain.board.Comment;
import com.backend.domain.board.form.CommentListForm;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentMapper {
    @Insert("""
            INSERT INTO comment
            (board_id,member_id,comment)
            VALUES (#{boardId},#{memberId},#{comment})
            """)
    int insert(Comment comment);

    @Select("""
            SELECT
                c.id,
                m.name memberName,
                c.comment,
                c.inserted
            FROM comment c
            JOIN member m ON m.id = c.member_id
            WHERE board_Id = #{boardId}
            ORDER BY c.id DESC
            """)
    List<CommentListForm> selectAll(Integer boardId);


    @Select("""
                    SELECT c.id, c.member_id,c.comment, c.inserted
                    FROM comment c JOIN member m ON m.id=c.member_id
                    WHERE c.id=#{commentId}
            """)
    Comment selectById(Integer id);

    @Delete("""
                DELETE FROM comment
                WHERE id=#{id}
            """)
    int deleteById(Integer id);

    @Update("""
                UPDATE comment
            SET  comment = #{comment}
             WHERE id = #{id}
             """)
    int update(Comment comment);

    @Delete("""
            DELETE FROM comment
            WHERE board_id = #{boardId}
            """)
    int deleteByBoardId(Integer boardId);
}
