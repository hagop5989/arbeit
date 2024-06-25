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


    //페이징
    @Select("""
              <script>
             SELECT b.id,
             b.member_id,
             b.title,
             b.inserted
            FROM board b JOIN member m ON m.id = b.member_id
             <trim prefix="WHERE" prefixOverrides="OR">
                    <if test="searchType != null">
                        <bind name="pattern" value="'%' + keyword + '%'" />
                        <if test="searchType == 'all' || searchType == 'title'">
                            OR b.title LIKE #{pattern}
                            OR b.member_id LIKE #{pattern}
                        </if>
                            <if test="searchType == 'all' || searchType == 'name'">
                            OR m.id LIKE #{pattern}
                        </if>
                         </if>
                         </trim>
                         GROUP BY b.id
            ORDER BY b.id DESC
            LIMIT #{offset},10
                       </script>
             """)
    List<Board> selectAllPaging(Integer offset, String searchType, String keyword);


    @Select("""
            SELECT COUNT(*) FROM board
            """)
    Integer countAll();

    @Select("""
            <script>
            SELECT COUNT(b.id)
            FROM board b JOIN member m ON b.member_id = m.id
               <trim prefix="WHERE" prefixOverrides="OR">
                   <if test="searchType != null">
                       <bind name="pattern" value="'%' + keyword + '%'" />
                       <if test="searchType == 'all' || searchType == 'name'">
                            OR b.title LIKE #{pattern}
                            OR m.id LIKE #{pattern}
                       </if>
                       <if test="searchType == 'all' || searchType == 'm.id'">
                           OR m.name LIKE #{pattern}
                       </if> 
                   </if>
               </trim>
            </script>
            """)
    Integer countAllWithSearch(String searchType, String keyword);


    @Delete("""
                DELETE FROM board_like
                            WHERE board_id = #{boardId}
                            AND member_id = #{memberId};
            """)
    int deleteLikeByBoardIdAndMemberId(Integer boardId, Integer memberId);


    @Insert("""
                   INSERT INTO board_like (board_id, member_id)
                   VALUES (#{boardId}, #{memberId})
            """)
    int insertLikeByBoardIdAndMemberId(Integer boardId, Integer memberId);

    @Select("""
                SELECT  COUNT(*)
                FROM board_like
                WHERE board_id = #{boardId}
            """)
    int selectCountLike(Integer boardId);

}


