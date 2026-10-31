package com.hendra.stockflow.backend.model.dto.response;


import com.hendra.stockflow.backend.model.entity.Category;
import com.hendra.stockflow.backend.model.entity.History;
import com.hendra.stockflow.backend.model.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponse {

    private Long id;
    private String name;
    private Double price;
    private Double salePrice;
    private Integer inStock;
    private Integer minimumStock;
    private Enum<ProductStatus> isActive;
    private Category category;
    private List<History> historyList = new ArrayList<>();
}
