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
                       b.inserted,
                       COUNT(DISTINCT c.id) AS number_of_comments,
                       COUNT(DISTINCT f.name) AS number_of_images,
                       COUNT(DISTINCT l.member_id) AS number_of_like,
                       COUNT(DISTINCT v.member_id) AS number_of_view
                FROM board b
                JOIN member m ON m.id = b.member_id
                LEFT JOIN board_image f ON b.id = f.board_id
                LEFT JOIN board_like l ON b.id = l.board_id
                LEFT JOIN comment c ON b.id = c.board_id
                LEFT JOIN board_view v ON b.id = v.board_id
                <where>
                    <if test="searchType != null">
                        <bind name="pattern" value="'%' + keyword + '%'" />
                        <if test="searchType == 'all' || searchType == 'text'">
                            b.title LIKE #{pattern}
                            OR b.member_id LIKE #{pattern}
                        </if>
                        <if test="searchType == 'all' || searchType == 'name'">
                            OR m.id LIKE #{pattern}
                        </if>
                    </if>
                </where>
                GROUP BY b.id
                <choose>
                    <when test="filterType == '작성일순'">
                        ORDER BY b.inserted DESC
                    </when>
                    <when test="filterType == '조회수순'">
                        ORDER BY number_of_view DESC
                    </when>
                    <when test="filterType == '좋아요순'">
                        ORDER BY number_of_like DESC
                    </when>
                <when test="filterType == '댓글순'">
                        ORDER BY number_of_comments DESC
                    </when>
                    <otherwise>
                        ORDER BY b.id DESC
                    </otherwise>
                </choose>
                LIMIT #{offset}, 10
            </script>
            """)
    List<Board> selectAllPaging(Integer offset, String searchType, String keyword, String filterType, String filterDetail);


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
    Integer countAllWithSearch(String searchType, String keyword, String filterType, String filterDetail);


    @Delete("""
                DELETE FROM board_like
                            WHERE board_id = #{boardId}
                            AND member_id = #{memberId};
            """)
    int deleteLikeByBoardIdAndMemberId(Integer boardId, Integer memberId);

    @Delete("""
                DELETE FROM board_view
                            WHERE board_id = #{boardId}
                            AND member_id = #{memberId};
            """)
    int deleteViewByBoardIdAndMemberId(Integer boardId, Integer memberId);


    @Insert("""
                   INSERT INTO board_like (board_id, member_id)
                   VALUES (#{boardId}, #{memberId})
            """)
    int insertLikeByBoardIdAndMemberId(Integer boardId, Integer memberId);


    @Insert("""
                   INSERT INTO board_view (board_id, member_id)
                   VALUES (#{boardId}, #{memberId})
            """)
    int insertViewByBoardIdAndMemberId(Integer boardId);


    @Select("""
                SELECT  COUNT(*)
                FROM board_like
                WHERE board_id = #{Id}
            """)
    int selectCountLike(Integer boardId);


    @Select("""
                SELECT  COUNT(*)
                FROM board_view
                WHERE board_id = #{Id}
            """)
    int selectCountView(Integer boardId);


    @Select("""
            SELECT COUNT(*) FROM board_like
            WHERE board_id=#{boardId}
              AND member_id=#{memberId}
            """)
    int selectLikeByBoardIdAndMemberId(Integer boardId, String memberId);


    @Select("""
            SELECT COUNT(*) FROM board_view
            WHERE board_id=#{boardId}
              AND member_id=#{memberId}
            """)
    int selectViewByBoardIdAndMemberId(Integer boardId, String memberId);


}


