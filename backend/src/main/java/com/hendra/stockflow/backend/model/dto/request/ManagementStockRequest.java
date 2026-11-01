package com.hendra.stockflow.backend.model.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hendra.stockflow.backend.model.enums.StockActionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ManagementStockRequest {
    @NotBlank
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_PROPERTIES)
    private StockActionType type;
    @NotNull
    private Integer total;
    @NotBlank
    private String description;

}
