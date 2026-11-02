package com.hendra.stockflow.backend.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SummaryResponse {
    private Long totalInStock;
    private Long totalOutStock;
    private Double totalAssetForStock;
}
