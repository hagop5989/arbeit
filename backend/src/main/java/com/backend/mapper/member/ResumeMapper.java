package com.backend.mapper.member;

import com.backend.domain.member.Resume;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ResumeMapper {


    @Insert("""
            INSERT INTO resume
            (member_id, title, content, birth_date, rookie, 
            address1, address2, email, phone, preferred_pay, 
            work_day_type, work_shift_type, deadline, preferred_job,gender)
            VALUES 
            (#{memberId}, #{title}, #{content}, #{birthDate}, #{rookie}, 
            #{address1}, #{address2}, #{email}, #{phone}, #{preferredPay}, 
            #{workDayType}, #{workShiftType}, #{deadline}, #{preferredJob},#{gender})
              """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
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


    @Insert("""
            INSERT INTO resume_file (resume_id, name)
            VALUES (#{resumeId},#{name})
            """)
    int insertFileName(Integer id, String originalFilename);


    @Delete("""
            DELETE FROM resume
            WHERE id = #{id}
            """)
    int delete(Integer id);

    @Update("""
            UPDATE resume SET 
            title = #{title}, 
            content = #{content}, 
            birth_date = #{birthDate}, 
            rookie = #{rookie}, 
            address1 = #{address1}, 
            address2 = #{address2}, 
            email = #{email}, 
            phone = #{phone}, 
            preferred_pay = #{preferredPay}, 
            work_day_type = #{workDayType}, 
            work_shift_type = #{workShiftType},
            deadline = #{deadline}, 
            preferred_job = #{preferredJob},
            gender = #{gender}
            WHERE id = #{id}         
                        """)
    int update(Resume resume);

}
