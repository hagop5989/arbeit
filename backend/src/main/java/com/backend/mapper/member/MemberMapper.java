package com.backend.mapper.member;

import com.backend.domain.authority.MemberAuth;
import com.backend.domain.member.Member;
import com.backend.domain.member.MemberSignupForm;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MemberMapper {

    @Insert("""
            INSERT INTO member (email, password, name, gender, birth_date, address, phone)
            VALUES (#{email}, #{password}, #{name}, #{gender}, #{birthDate}, #{address}, #{phone})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(MemberSignupForm form);

    @Select("SELECT * FROM member ORDER BY id DESC")
    List<Member> selectAll();

    @Select("""
            SELECT *
            FROM member
            WHERE email=#{email}
            """)
    Member selectByEmail(String email);

    @Select("""
            SELECT *
            FROM member
            WHERE id=#{id}
            """)
    Member selectById(Integer id);

    @Update("""
            UPDATE member
            SET password=#{password}, name=#{name}, address=#{address}, phone=#{phone}
            WHERE id=#{id}
            """)
    void updateById(Member member);

    @Delete("DELETE FROM member WHERE id=#{id}")
    void deleteById(Integer id);

    /**
     * 권한 관련 SQL
     */
    @Insert("""
            INSERT INTO authority (member_id, name)
            VALUES (#{memberId}, #{authority})
            """)
    void insertAuth(MemberAuth auth);

    @Select("""
            SELECT name
            FROM authority
            WHERE member_id=#{memberId}
            """)
    String selectAuthById(Integer memberId);
}
