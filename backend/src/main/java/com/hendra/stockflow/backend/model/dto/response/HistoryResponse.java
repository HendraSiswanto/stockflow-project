package com.hendra.stockflow.backend.model.dto.response;

import com.hendra.stockflow.backend.model.entity.Product;
import com.hendra.stockflow.backend.model.enums.ProductStatus;
import com.hendra.stockflow.backend.model.enums.StockActionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryResponse {

    private Long id;
    private LocalDateTime date;
    private StockActionType type;
    private Integer inStock;
    private Integer outStock;
    private Integer totalStock;
    private ProductStatus productStatus;
    private String description;
    private Long productId;
    private String productName;
    private String productCategory;

}
