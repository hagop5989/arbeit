package com.backend.mapper.jobs;

import com.backend.domain.jobs.Jobs;
import com.backend.domain.store.Store;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface JobsMapper {
    @Insert("""
            INSERT INTO jobs
            (member_id, store_id, category_id, title, content,
             salary, deadline, recruitment_number, store_name,start_time,end_time,x,y,marker_name)
            VALUES
            (#{memberId},#{storeId},#{categoryId},#{title},#{content},
            #{salary},#{deadline},#{recruitmentNumber},#{storeName},#{startTime},#{endTime},#{x},#{y},#{markerName})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
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
                   j.content,
                   j.salary,
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
            LIMIT #{offset}, 8
            </script>
                """)
    List<Jobs> selectAllPaging(int offset, String searchType, String keyword);

    @Insert("""
            INSERT INTO jobs_file (jobs_id, name)
            VALUES (#{jobsId},#{name})
            """)
    int insertFileName(Integer jobsId, String name);

    @Select("""
            SELECT name 
            FROM jobs_file 
            WHERE jobs_id = #{jobsId}
            """)
    List<String> selectFileNameByJobsId(Integer jobsId);


    @Delete("""
            DELETE FROM jobs_file
            WHERE jobs_id = #{jobsId}
            AND name = #{fileName}
            """)
    int deleteFileByJobsIdAndName(Integer jobsId, String fileName);

    @Delete("""
            DELETE FROM jobs_file 
            WHERE jobs_id = #{jobsId}
            """)
    int deleteFileByJobsId(Integer jobsId);


    @Select("""
            SELECT * FROM store
            WHERE member_id = #{jobsMemberId}
            """)
    List<Store> selectStoreByJobsMemberId(Integer jobsMemberId);


    @Select("""
            SELECT * FROM category
            WHERE id = #{categoryId}
            """)
    void selectCategoryByCategoryId(Integer categoryId);
}
