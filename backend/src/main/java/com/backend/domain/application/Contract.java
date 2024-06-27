package com.backend.domain.application;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Contract {

    private Integer bossId;
    @NotNull
    private Integer albaId;
    @NotNull
    private Integer jobsId;
    @NotNull
    private Date startDate;
    @NotNull
    private Date endDate;

}
