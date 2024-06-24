package com.backend.mapper.contract;

import com.backend.domain.contract.Contract;
import com.backend.domain.management.Management;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ContractMapper {


    @Insert("""
    INSERT INTO contract
        (jobs_id, alba_id, boss_id, start_date, end_date)
    VALUES
        (#{jobsId}, #{albaId}, #{bossId}, #{startDate}, #{endDate})
    """)
    int insert(Contract contract);

    @Delete("""
    DELETE FROM contract
    WHERE jobs_id = #{management.jobsId}
      AND alba_id = #{management.appliedMemberId}
      AND boss_id = #{bossId}
    """)
    int deleteByIds(Management management, Integer bossId);

    @Select("""
    SELECT * FROM contract 
    WHERE jobs_id = #{management.jobsId}
    AND alba_id = #{management.appliedMemberId}
    AND boss_id = #{bossId} 
    """)
    Contract selectByIds(Management management, Integer bossId);

    @Select("""
    SELECT c.*,
       j.title AS jobsTitle,
       s.name AS storeName
    FROM contract c
        JOIN jobs j ON j.id = c.jobs_id
        JOIN store s ON s.id = j.store_id
    WHERE alba_id = #{memberId}
    """)
    List<Contract> listForAlba( Integer memberId);

    @Select("""
    SELECT c.*,
        j.title AS jobsTitle,
        m.name AS albaName
    FROM contract c
        JOIN jobs j ON j.id = c.jobs_id
        JOIN member m ON m.id = c.alba_id
    WHERE boss_id = #{memberId}
    """)
    List<Contract> listForBoss(Integer memberId);
}
