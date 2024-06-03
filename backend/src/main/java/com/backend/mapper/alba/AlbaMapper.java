package com.backend.mapper.alba;

import com.backend.domain.alba.AlbaSignupForm;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AlbaMapper {

    @Insert("""
            INSERT INTO alba (email, password, name, address, phone)
            VALUES (#{email}, #{password}, #{name}, #{address}, #{phone})
            """)
    void insert(AlbaSignupForm form);
}
