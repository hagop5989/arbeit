package com.backend.mapper.member;

import com.backend.domain.member.ProfilePicture;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ProfilePictureMapper {

    @Insert("""
            INSERT INTO profile_picture (member_id, src) VALUES (#{memberId}, #{src})
            ON DUPLICATE KEY UPDATE src = VALUES(src);
            """)
    void insertORUpdate(ProfilePicture picture);

    @Select("""
            SELECT *
            FROM profile_picture
            WHERE member_id=#{memberId}
            """)
    ProfilePicture selectByMemberId(Integer memberId);
}
