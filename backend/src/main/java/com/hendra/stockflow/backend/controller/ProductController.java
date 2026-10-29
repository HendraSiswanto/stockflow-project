package com.hendra.stockflow.backend.controller;

import com.hendra.stockflow.backend.model.dto.request.ProductRequest;
import com.hendra.stockflow.backend.model.entity.Product;
import com.hendra.stockflow.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ProductController {

    private ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/products")
    public ResponseEntity<Product> insertNewProduct(@RequestBody ProductRequest productRequest){

        Product newProduct = productService.createProduct(productRequest);
        return null;

    }
}
