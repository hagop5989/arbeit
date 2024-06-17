package com.backend.mapper.jobs;

import com.backend.domain.jobs.Jobs;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface JobsMapper {
    /**
     * CREATE
     */
    @Insert("""
            INSERT INTO jobs
            (member_id, store_id, category_id, title, content,
             salary, deadline, recruitment_number)
            VALUES
            (#{memberId},#{storeId},#{categoryId},#{title},#{content},
            #{salary},#{deadline},#{recruitmentNumber})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Jobs jobs);

    /**
     * READ
     */
    // TODO : Jobs 엔티티 수정해야함
    @Select("""
            SELECT
                j.*,
                m.name memberName,
                s.name storeName,
                c.id categoryId,
                c.name categoryName
            FROM jobs j
                JOIN store s ON s.id = j.store_id
                JOIN member m ON m.id = j.member_id
                JOIN category c ON c.id = j.category_id
            WHERE j.id = #{id}
            """)
    Jobs selectById(Integer id);

    @Select("""
            SELECT s.id, s.name, category_id categoryId, c.name categoryName
            FROM store s JOIN category c ON c.id = s.category_id
            WHERE member_id = #{memberId}
            """)
    List<Map<String, Object>> selectStoreNamesByMemberId(Integer memberId);

    // Paging
    @Select("""
            <script>
            SELECT COUNT(j.id) 
            FROM jobs j JOIN member m ON j.member_id = m.id
                <trim prefix="WHERE" prefixOverrides="OR">
                    <if test="searchType != null">
                        <bind name="pattern" value="'%' + keyword + '%'" />
                        <if test="searchType == 'all' || searchType == 'text'">
                            OR j.title LIKE #{pattern}
                            OR j.content LIKE #{pattern}
                        </if>
                        <if test="searchType == 'all' || searchType == 'nickName'">
                        OR m.name LIKE #{pattern}
                        </if>
                     </if>
                </trim>
            </script>
            """)
    Integer countAllWithSearch(String searchType, String keyword);

    @Select("""
            <script>
            SELECT j.*,jc.*,
                   s.address,
                   s.name AS storeName,
                   m.name AS memberName,
                   c.name AS categoryName
            FROM jobs j 
            JOIN member m ON j.member_id = m.id 
            JOIN store s ON s.id = j.store_id
            JOIN category c ON c.id = j.category_id
            JOIN jobs_condition jc ON jc.jobs_id = j.id
               <trim prefix="WHERE" prefixOverrides="OR">
                   <if test="searchType != null">
                       <bind name="pattern" value="'%' + keyword + '%'" />
                       <if test="searchType == 'all' || searchType == 'text'">
                           OR j.title LIKE #{pattern}
                           OR j.content LIKE #{pattern}
                       </if>
                       <if test="searchType == 'all' || searchType == 'nickName'">
                           OR m.name LIKE #{pattern}
                       </if>
                   </if>
               </trim>
            GROUP BY j.id
            ORDER BY j.id DESC
            LIMIT #{offset}, 8
            </script>
                """)
    List<Jobs> selectAllPaging(int offset, String searchType, String keyword);

    // Update
    @Update("""
            UPDATE jobs
            SET title=#{title},
                content=#{content},
                salary=#{salary},
                deadline=#{deadline},
                recruitment_number=#{recruitmentNumber}
            WHERE id = #{id}
            """)
    int updateById(Jobs jobs);

    // Delete
    @Delete("""
            DELETE FROM jobs
            WHERE id=#{id}
            """)
    int deleteById(Integer id);

}
