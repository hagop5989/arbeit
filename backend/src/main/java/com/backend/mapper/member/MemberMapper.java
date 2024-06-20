package com.backend.mapper.member;

import com.backend.domain.authority.MemberAuth;
import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MemberMapper {

    @Insert("""
            INSERT INTO member (email, password, name, gender, birth_date, address, phone)
            VALUES (#{email}, #{password}, #{name}, #{gender}, #{birthDate}, #{address}, #{phone})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Member member);

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

    @Update("""
            UPDATE member
            SET
                email=#{deleted},
                name='탈퇴한 유저',
                password='X',
                gender='X',
                birth_date='0000-00-00',
                address='X',
                phone='X',
                inserted='0000-00-00 00:00:00'
            WHERE id=#{id}
            """)
    void deleteById(Integer id, String deleted);

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

    @Select("""
            SELECT email
            FROM member
            WHERE name=#{name} AND phone=#{phone}
            """)
    String selectByNameAndPhone(String name, String phone);

    @Update("""
            UPDATE member
            SET password=#{password}
            WHERE email=#{email}
            """)
    void updatePwdByEmail(String email, String password);
}
