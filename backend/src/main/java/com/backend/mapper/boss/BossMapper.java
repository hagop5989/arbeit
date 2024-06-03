package com.backend.mapper.boss;

import com.backend.domain.boss.Boss;
import org.apache.ibatis.annotations.*;

@Mapper
public interface BossMapper {

    @Insert("""
    INSERT INTO boss(email, password, name, address, phone)
    VALUES (#{email},#{password},#{name},#{address},#{phone})
    """)
    int insert(Boss boss);

    @Select("""
            SELECT * FROM boss
            WHERE email = #{email}
            """)
    Boss selectByBossDetails(Boss boss);

    @Select("""
            SELECT * FROM boss
            WHERE email = #{email}
            """)
    Boss selectByBossEmail(String email);



    @Update("""
            UPDATE boss
            SET
            email = #{email},
            password = #{password},
            name = #{name},
            address = #{address},
            phone = #{phone}
            """)
    int update(Boss boss);

    @Delete("""
            DELETE FROM boss
            WHERE id = #{id}
            """)
    int delete(Boss boss);
}
