package com.backend.mapper.boss;

import com.backend.domain.boss.Boss;
import org.apache.ibatis.annotations.*;

@Mapper
public interface BossMapper {

    @Insert("""
            INSERT INTO member(email, password, name, address, phone)
            VALUES (#{email},#{password},#{name},#{address},#{phone})
            """)
    int insert(Boss boss);

    @Select("""
            SELECT * FROM member
            WHERE email = #{email}
            """)
    Boss selectByBossDetails(Boss boss);

    @Select("""
            SELECT * FROM member
            WHERE email = #{email}
            """)
    Boss selectByBossEmail(String email);


    @Update("""
            <script>
            UPDATE boss
            SET
            <if test="email != null and email != ''">
            email = #{email},
            </if>
            password = #{password},
            name = #{name},
            address = #{address},
            phone = #{phone}
            WHERE email = #{email}
            </script>
            """)
    int updateByBossEmail(Boss boss);

    @Delete("""
            DELETE FROM boss
            WHERE id = #{id}
            """)
    int deleteByBossId(Integer id);

    @Select("""
            SELECT * FROM member
            WHERE id = #{id}
            """)
    Boss selectByBossId(Integer id);

}
