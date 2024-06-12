package com.backend.mapper.store;

import com.backend.domain.store.Store;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface StoreMapper {

    @Insert("""
                INSERT INTO store (name, content, address, phone, category_id, member_id, cate_name)
                VALUES (#{name}, #{content}, #{address}, #{phone}, #{categoryId}, #{memberId}, #{cateName})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    public int insert(Store store);

    @Select("""
            SELECT s.id, s.name, s.content, s.address, s.phone, c.name cate, s.member_id, c.icon
            FROM store s JOIN category c ON s.category_id = c.id
            ORDER BY id
            """)
    List<Store> selectAll();

    @Delete("""
            DELETE FROM store
            WHERE id = #{id}
            """)
    int deleteById(Integer id);

    @Select("""
            SELECT s.id,
                   s.name,
                   s.content,
                   s.address,
                   s.phone,
                   c.name cate,
                   s.member_id,
                   c.icon,
                   s.category_id
            FROM store s JOIN member m ON s.member_id = m.id JOIN category c ON s.category_id = c.id
            WHERE s.id = #{id}
            """)
    Store selectByStoreId(Integer id);

    @Update("""
                UPDATE store
                SET name= #{name}, content= #{content}, address= #{address}, phone= #{phone}, category_id= #{categoryId}
                WHERE id = #{id}
            """)
    int update(Store store);

    @Insert("""
            INSERT INTO store_file (store_id, name)
            VALUES (#{storeId}, #{name})
            """)
    int insertFileName(Integer storeid, String name);


    @Select("""
            SELECT id, name
            FROM category
            ORDER BY id
            """)
    List<Store> setcate();

    @Select("""
            SELECT name
            FROM 
            """)
    List<String> StoreImageByStoreId(Integer id);
}
