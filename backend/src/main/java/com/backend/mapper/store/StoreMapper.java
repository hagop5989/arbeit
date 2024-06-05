package com.backend.mapper.store;

import com.backend.domain.store.Store;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface StoreMapper {

    @Insert("""
                INSERT INTO store (name, content, address, category)
                VALUES (#{name}, #{content}, #{address}, #{category})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
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

    @Select("""
            SELECT id, name, content, address, category
            FROM store
            WHERE id = #{id}
            """)
    Store selectByStoreId(Integer id);

    @Update("""
            UPDATE store
            SET name= #{name}, content= #{content}, address= #{address}, category= #{category}
            """)
    int update(Store store);

    @Insert("""
            INSERT INTO store_file (store_id, name)
            VALUES (#{storeId}, #{name})
            """)
    int insertFileName(Integer storeid, String name);
}
