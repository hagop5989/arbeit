package com.backend.mapper.store;

import com.backend.domain.store.Store;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface StoreMapper {

    @Insert("""
                INSERT INTO store (name, content, address, category)
                VALUES (#{name}, #{content}, #{address}, #{category})
            """)

    public int insert(Store store);

    @Select("""
            SELECT id, name, content, address, category
            FROM store
            ORDER BY id
            """)
    List<Store> selectAll();

    @Delete("""
            DELETE FROM store
            WHERE id = #{id}
            """)
    int deleteById(Integer id);
}
