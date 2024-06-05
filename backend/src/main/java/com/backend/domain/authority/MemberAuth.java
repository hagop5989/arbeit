package com.backend.domain.authority;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemberAuth {
    private Integer memberId;
    private Authority authority;
}
