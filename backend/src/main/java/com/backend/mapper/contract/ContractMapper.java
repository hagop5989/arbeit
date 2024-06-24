package com.backend.mapper.contract;

import com.backend.domain.contract.Contract;
import com.backend.domain.management.Management;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ContractMapper {


    @Insert("""
            INSERT INTO contract
                (jobs_id, alba_id, store_id, start_date, end_date)
            VALUES
                (#{jobsId}, #{albaId}, #{storeId}, #{startDate}, #{endDate})
            """)
    int insert(Contract contract);

    @Delete("""
            DELETE FROM contract
            WHERE jobs_id = #{jobsId}
              AND alba_id = #{appliedMemberId}
              AND store_id = #{storeId}
            """)
    int deleteByIds(Management management);

    @Select("""
            SELECT * FROM contract 
            WHERE jobs_id = #{jobsId}
            AND alba_id = #{appliedMemberId}
            AND store_id = #{storeId} 
            """)
    Contract selectByIds(Management management);

    @Select("""
            SELECT c.*,
               j.title AS jobsTitle,
               s.name AS storeName
            FROM contract c
                JOIN jobs j ON j.id = c.jobs_id
                JOIN store s ON s.id = j.store_id
            WHERE alba_id = #{memberId}
            """)
    List<Contract> listForAlba(Integer memberId);

    @Select("""
            SELECT c.*,
                j.title AS jobsTitle,
                m.name AS albaName
            FROM contract c
                JOIN jobs j ON j.id = c.jobs_id
                JOIN member m ON m.id = c.alba_id
            WHERE c.store_id
                  IN (SELECT store_id FROM jobs WHERE member_id = #{bossId})
            """)
    List<Contract> listForBoss(Integer bossId);
}
