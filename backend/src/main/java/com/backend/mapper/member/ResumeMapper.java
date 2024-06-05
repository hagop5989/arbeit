package com.backend.mapper.member;

import com.backend.domain.member.Resume;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ResumeMapper {


    @Insert("""
            INSERT INTO resume( member_id, title, content)
            VALUES ( #{memberId}, #{title}, #{content})
            """)
    void insert(Resume resume);

    @Select("""
            SELECT * FROM resume
            WHERE member_id = #{memberId}
            """)
    List<Resume> list(Integer memberId);

    @Select("""
            SELECT * FROM resume
            WHERE id = #{id}
            """)
    Resume select(Integer id);

}
