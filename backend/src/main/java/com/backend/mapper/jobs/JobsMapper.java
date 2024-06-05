package com.backend.mapper.jobs;

import com.backend.domain.jobs.Jobs;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface JobsMapper {
    @Insert("""
            INSERT INTO jobs( title, content, store_name, store_id, member_id)
            VALUES(#{title}, #{content}, #{storeName}, #{storeId}, #{memberId})
            """)
    int insert(Jobs jobs);

    @Update("""
            UPDATE jobs SET
            title = #{title},
            content = #{content},
            store_name = #{storeName},
            store_id = #{storeId},
            member_id = #{memberId}
            WHERE id = #{id}
            """)
    int update(Jobs jobs);

    @Select("""
            SELECT * FROM jobs
            WHERE id = #{id}
            """)
    Jobs selectByJobsId(Integer id);

    @Select("""
            SELECT j.id, j.title, j.store_name, m.name AS memberName, j.inserted
            FROM jobs j
            JOIN member m ON j.member_id = m.id
            WHERE m.id = #{memberId}
            ORDER BY id DESC
            LIMIT #{offset},10
            """)
    List<Jobs> findAllByMemberId(Integer memberId, Integer offset);

    @Delete("""
            DELETE FROM jobs
            WHERE id=#{id}
            """)
    int deleteByJobsId(Integer id);

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
            SELECT j.id,
                   j.title,
                   j.store_name,
                   j.inserted,
                   m.name AS memberName
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
            GROUP BY j.id
            ORDER BY j.id DESC
            LIMIT #{offset}, 10
            </script>
                """)
    List<Jobs> selectAllPaging(int offset, String searchType, String keyword);


}
