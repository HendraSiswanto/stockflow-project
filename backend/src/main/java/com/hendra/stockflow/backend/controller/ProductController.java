package com.hendra.stockflow.backend.controller;

import com.hendra.stockflow.backend.exception.ProductException;
import com.hendra.stockflow.backend.model.dto.request.ProductRequest;
import com.hendra.stockflow.backend.model.dto.response.ProductResponse;
import com.hendra.stockflow.backend.model.entity.Product;
import com.hendra.stockflow.backend.service.CategoryService;
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
    @Autowired
    private ProductService productService;

    @PostMapping("/products")
    public ResponseEntity<ProductResponse> insertNewProduct(@RequestBody ProductRequest productRequest){

        ResponseEntity<ProductResponse> response;
        if (productRequest.getMinimumStock() == null){
            productRequest.setMinimumStock(2);
            Product newProduct = productService.createProduct(productRequest);
            response = new ResponseEntity<>( ProductResponse.builder().id(newProduct.getId()).name(newProduct.getName()).price(newProduct.getPrice()).salePrice(newProduct.getSalePrice()).inStock(newProduct.getInStock()).minimumStock(newProduct.getMinimumStock()).category(newProduct.getCategory()).build(), HttpStatus.OK);
        }else {
            Product newProduct = productService.createProduct(productRequest);
            response = new ResponseEntity<>( ProductResponse.builder().id(newProduct.getId()).name(newProduct.getName()).price(newProduct.getPrice()).salePrice(newProduct.getSalePrice()).inStock(newProduct.getInStock()).minimumStock(newProduct.getMinimumStock()).category(newProduct.getCategory()).build(), HttpStatus.OK);
        }
       return response;

    }
}
