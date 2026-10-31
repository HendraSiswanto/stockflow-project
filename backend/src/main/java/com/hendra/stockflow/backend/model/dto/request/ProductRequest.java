package com.hendra.stockflow.backend.model.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hendra.stockflow.backend.model.entity.Category;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
public class ProductRequest {

    @NotBlank
    private String name;
    @NotNull
    private Double price;
    @NotNull
    private Double salePrice;
    @NotNull
    private Integer inStock;
    @NotNull
    private Integer minimumStock;
    @NotBlank
    private Long categoryId;
}
