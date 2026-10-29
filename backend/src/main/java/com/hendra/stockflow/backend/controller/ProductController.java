package com.hendra.stockflow.backend.controller;

import com.hendra.stockflow.backend.model.dto.request.ProductRequest;
import com.hendra.stockflow.backend.model.dto.response.ProductResponse;
import com.hendra.stockflow.backend.model.entity.Product;
import com.hendra.stockflow.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<ProductResponse> insertNewProduct(@RequestBody ProductRequest productRequest){

        Product newProduct = productService.createProduct(productRequest);
        ProductResponse response = ProductResponse.builder().id(newProduct.getId()).name(newProduct.getName()).price(newProduct.getPrice()).salePrice(newProduct.getSalePrice()).inStock(newProduct.getInStock()).minimumStock(newProduct.getMinimumStock()).build();
        return new ResponseEntity<>(response, HttpStatus.OK);

    }
}
