package com.backend.mapper.board;

import com.backend.domain.board.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO board (member_Id, title, content,files)
            VALUES (#{memberId}, #{title},#{content},#{files})
            """
    )
    int insert(Board board);


    @Select("""
            SELECT b.id, b.member_id, m.name, title,files, b.inserted
            FROM board b JOIN member m ON m.id = b.member_id
            ORDER BY id DESC
            """)
    List<Board> selectAll();

    @Select("""
                SELECT b.id, m.name, b.member_id, title, content,files, b.inserted
                FROM board b JOIN member m ON m.id = b.member_id
                WHERE b.id= #{id}
            """)
    Board selectById(Integer id);


    @Delete("""
            DELETE FROM board
            WHERE id= #{id}
            """)
    int deleteById(Integer id);


    @Update("""
            UPDATE board
            SET title=#{title},
                content=#{content},
                files=#{files}
            WHERE id= #{id}
            """)
    int update(Board board);


}
