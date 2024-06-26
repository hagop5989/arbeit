package com.backend.mapper.resume;

import com.backend.domain.resume.Resume;
import com.backend.domain.resume.ResumeForm;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ResumeMapper {

    @Insert("""
            INSERT INTO resume (member_id, title, content, is_rookie)
            VALUES (#{memberId}, #{title}, #{content}, #{isRookie})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(ResumeForm form);

    @Select("""
            SELECT id, title, inserted FROM resume
            WHERE member_id = #{memberId}
            """)
    List<Resume> selectAllByMemberId(Integer memberId);

    @Select("""
            SELECT COUNT(id) FROM resume
            WHERE member_id = #{memberId}
            """)
    Integer selectAllOfCount(String memberId);


    @Select("""
            SELECT r.id,
                   r.member_id,
                   m.gender,
                   m.birth_date,
                   m.email,
                   m.phone,
                   r.title,
                   r.content,
                   r.is_rookie,
                   r.inserted
            FROM resume r JOIN member m on r.member_id = m.id
            WHERE r.id = #{id}
            """)
    Resume selectById(Integer id);

    @Delete("""
            DELETE FROM resume
            WHERE id = #{id}
            """)
    int deleteById(Integer id);

    @Update("""
            UPDATE resume
            SET
            title=#{title},
            content=#{content},
            is_rookie=#{isRookie}
            WHERE id = #{id}
            """)
    int update(ResumeForm form);

    @Select("""
            SELECT DISTINCT j.member_id boss_id
            FROM resume r
                     JOIN application a ON r.id = a.resume_id
                     JOIN jobs j ON a.jobs_id = j.id
            WHERE resume_id = #{resumeId};
            """)
    List<Integer> findBossIdsById(Integer resumeId);

    @Select("""
            SELECT member_id
            FROM resume
            WHERE id=#{id}
            """)
    Integer findMemberIdById(Integer id);
}
