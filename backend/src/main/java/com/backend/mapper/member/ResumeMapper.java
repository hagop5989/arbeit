package com.backend.mapper.member;

import com.backend.domain.member.resume.Resume;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ResumeMapper {


    @Insert("""
            INSERT INTO resume (member_id, title, content, is_rookie)
            VALUES (#{memberId}, #{title}, #{content}, #{isRookie})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Resume resume);

    @Select("""
            SELECT id, title, inserted FROM resume
            WHERE member_id = #{memberId}
            """)
    List<Resume> list(Integer memberId);

    @Select("""
            SELECT * FROM resume
            WHERE id = #{id}
            """)
    Resume select(Integer id);


    @Insert("""
            INSERT INTO resume_photo (resume_id, name)
            VALUES (#{resumeId},#{name})
            """)
    int insertFileName(Integer id, String originalFilename);


    @Delete("""
            DELETE FROM resume
            WHERE id = #{id}
            """)
    int delete(Integer id);

    @Update("""
            UPDATE resume
            SET
            title = #{title},
            content = #{content}
            WHERE id = #{id}
            """)
    int update(Resume resume);

}
