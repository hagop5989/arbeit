package com.backend.mapper.alba;

import com.backend.domain.alba.Alba;
import com.backend.domain.alba.AlbaSignupForm;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AlbaMapper {

    @Insert("""
            INSERT INTO alba (email, password, name, address, phone)
            VALUES (#{email}, #{password}, #{name}, #{address}, #{phone})
            """)
    void insert(AlbaSignupForm form);

    @Select("SELECT * FROM alba ORDER BY id DESC")
    List<Alba> selectAll();

    @Select("""
            SELECT *
            FROM alba
            WHERE email=#{email}
            """)
    Alba selectByEmail(String email);

    @Select("""
            SELECT *
            FROM alba
            WHERE id=#{id}
            """)
    Alba selectById(Integer id);

    @Update("""
            UPDATE alba
            SET email=#{email}, name=#{name}, address=#{address}, phone=#{phone}
            WHERE id=#{id}
            """)
    void updateById(Alba alba);

    @Delete("DELETE FROM alba WHERE id=#{id}")
    void deleteById(Integer id);
}
