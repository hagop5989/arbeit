package com.backend.mapper.store;

import com.backend.domain.store.Category;
import com.backend.domain.store.Store;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface StoreMapper {

    @Select("""
            SELECT *
            FROM category
            """)
    List<Category> selectAllCategory();

    @Insert("""
                INSERT INTO store (name, content, address, detail_address, phone, member_id, category_id)
                VALUES (#{name}, #{content}, #{address}, #{detailAddress}, #{phone}, #{memberId}, #{categoryId})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Store store);

    @Select("""
            SELECT
                s.id,
                s.name,
                content,
                address,
                detail_address,
                phone,
                inserted,
                member_id,
                category_id,
                c.name category_name
            FROM store s JOIN category c ON s.category_id = c.id
            WHERE member_id=#{memberId}
            ORDER BY id DESC
            """)
    List<Store> selectAllByMemberId(String memberId);

    @Select("""
            SELECT
                s.id,
                s.name,
                content,
                address,
                detail_address,
                phone,
                inserted,
                member_id,
                category_id,
                c.name category_name
            FROM store s JOIN category c ON s.category_id = c.id
            WHERE s.id = #{id}
            """)
    Store selectById(Integer id);

    @Select("""
            SELECT name FROM store_images
            WHERE store_id = #{id}
            """)
    List<String> selectImagesByStoreId(Integer id);

    @Delete("""
            DELETE FROM store
            WHERE id = #{id}
            """)
    int deleteById(Integer id);

    @Update("""
                UPDATE store
                SET name= #{name}, content= #{content}, address= #{address}, phone= #{phone}, category_id= #{categoryId}, cate_name= #{cateName}
                WHERE id = #{id}
            """)
    int update(Store store);

    @Insert("""
            INSERT INTO store_images (store_id, name)
            VALUES (#{storeId}, #{name})
            """)
    int insertImage(Integer storeId, String name);

    @Delete("""
            DELETE FROM store_file
            WHERE store_id = #{id}
            """
    )
    int deleteFileByStoreId(Integer id);

    @Delete("""
            DELETE FROM store_file
            WHERE store_id = #{id}
            AND name = #{fileName}
            """)
    int deleteFileByStoreIdAndName(Integer id, String fileName);

}
