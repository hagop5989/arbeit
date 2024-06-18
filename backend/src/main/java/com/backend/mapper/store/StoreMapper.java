package com.backend.mapper.store;

import com.backend.domain.store.Category;
import com.backend.domain.store.Store;
import com.backend.domain.store.StoreEditForm;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface StoreMapper {

    /**
     * INSERT
     */
    @Insert("""
            INSERT INTO store (name, content, address, detail_address, phone, member_id, category_id)
            VALUES (#{name}, #{content}, #{address}, #{detailAddress}, #{phone}, #{memberId}, #{categoryId})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Store store);

    @Insert("""
            INSERT INTO store_images (store_id, name)
            VALUES (#{storeId}, #{name})
            """)
    int insertImage(Integer storeId, String name);

    /**
     * SELECT
     */
    @Select("""
            SELECT *
            FROM category
            """)
    List<Category> selectAllCategory();

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
            WHERE store_id = #{storeId}
            """)
    List<String> selectImagesById(Integer storeId);

    /**
     * UPDATE
     */
    @Update("""
            UPDATE store
            SET
                name= #{name},
                content= #{content},
                address= #{address},
                detail_address=#{detailAddress},
                phone= #{phone},
                category_id= #{categoryId}
            WHERE id = #{id}
            """)
    int update(StoreEditForm form);

    /**
     * DELETE
     */
    @Delete("""
            DELETE FROM store
            WHERE id = #{id}
            """)
    int deleteById(Integer id);

    @Delete("""
            DELETE FROM store_images
            WHERE store_id = #{storeId}
            """)
    int deleteImagesById(Integer storeId);

    @Delete("""
            DELETE FROM store_images
            WHERE store_id = #{storeId} AND name = #{name}
            """)
    int deleteImageByIdAndName(Integer storeId, String name);


}
