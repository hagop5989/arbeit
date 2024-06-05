package com.backend.mapper.alba;

import com.backend.domain.member.Alba;
import com.backend.domain.member.MemberSignupForm;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AlbaMapper {

    @Insert("""
            INSERT INTO member (email, password, name, address, phone, authority)
            VALUES (#{email}, #{password}, #{name}, #{address}, #{phone}, #{authority})
            """)
    void insert(MemberSignupForm form);

    @Select("SELECT * FROM member ORDER BY id DESC")
    List<Alba> selectAll();

    @Select("""
            SELECT *
            FROM member
            WHERE email=#{email}
            """)
    Alba selectByEmail(String email);

    @Select("""
            SELECT *
            FROM member
            WHERE id=#{id}
            """)
    Alba selectById(Integer id);

    @Update("""
            UPDATE member
            SET email=#{email}, name=#{name}, address=#{address}, phone=#{phone}
            WHERE id=#{id}
            """)
    void updateById(Alba alba);

    @Delete("DELETE FROM member WHERE id=#{id}")
    void deleteById(Integer id);
}
