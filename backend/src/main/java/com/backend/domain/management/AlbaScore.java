package com.backend.domain.management;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlbaScore {

    private Integer albaId;
    private Integer bossId;
    private Integer albaScore;
}
