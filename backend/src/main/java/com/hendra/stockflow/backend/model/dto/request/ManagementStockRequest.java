package com.hendra.stockflow.backend.model.dto.request;

import com.hendra.stockflow.backend.model.enums.StockActionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ManagementStockRequest {
    @NotBlank
    private Enum<StockActionType> type;
    @NotNull
    private Integer total;
    private String description;

}
