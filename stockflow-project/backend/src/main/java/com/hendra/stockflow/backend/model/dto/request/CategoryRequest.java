package com.hendra.stockflow.backend.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryRequest {
    @NotBlank(message = "Nama wajib diisi")
    private String name;
}
