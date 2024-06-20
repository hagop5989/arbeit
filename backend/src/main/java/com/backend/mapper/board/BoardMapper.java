package com.backend.mapper.board;

import com.backend.domain.board.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO board (member_Id, title, content)
            VALUES (#{memberId}, #{title},#{content})
            """
    )
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Board board);


    @Select("""
            SELECT b.id, b.member_id, m.name, title, b.inserted
            FROM board b JOIN member m ON m.id = b.member_id
            ORDER BY id DESC
            """)
    List<Board> selectAll();

    @Select("""
                SELECT b.id, m.name, b.member_id, b.title, b.content, b.inserted
                FROM board b JOIN member m ON m.id = b.member_id
                WHERE b.id= #{id}
            """)
    Board selectById(Integer boardId);


    @Delete("""
            DELETE FROM board
            WHERE id= #{id}
            """)
    int deleteById(Integer id);


    @Update("""
            UPDATE board
            SET title=#{title},
                content=#{content}
            WHERE id=#{id}
            """)
    int update(Board board);

//파일

    @Insert("""
            INSERT INTO board_image (board_id, name)
            VALUES (#{boardId},#{name})
            ON DUPLICATE KEY UPDATE name = VALUES(name);
            """)
    int insertImage(Integer boardId, String name);

    @Select("""
            SELECT name
            FROM board_image
            WHERE board_id = #{boardId}
            """)
    List<String> selectImageNameById(Integer boardId);

    @Delete("""
            DELETE FROM board_image
            WHERE board_id = #{boardId}
            AND name = #{imageName}
            """)
    int deleteByboardIdAndImageName(Integer boardId, String imageName);

    @Delete("""
            DELETE FROM board_image
            WHERE board_id=#{boardId}
            """)
    int deleteByboardId(Integer boardId);

}


