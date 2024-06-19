package com.backend.mapper.board;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BoardFileMapper {

    @Insert("""
            INSERT INTO board_images (board_id, name)
            VALUES (#{boardId}, #{name})
            """)
    int insertImage(Integer boardId, String name);


    @Select("""
            SELECT name FROM board_images
            WHERE board_id = #{boardId}
            """)
    List<String> selectImagesById(Integer boardId);

    @Delete("""
            DELETE FROM board_images
            WHERE board_id = #{boardId}
            """)
    int deleteByImagesId(Integer boardId);

    @Delete("""
            DELETE FROM board_images
            WHERE board_id = #{boardId} AND name = #{name}
            """)
    int deleteImageByIdAndName(Integer boardId, String name);

}
