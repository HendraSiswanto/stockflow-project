package com.hendra.stockflow.backend.controller;

import com.hendra.stockflow.backend.exception.ProductException;
import com.hendra.stockflow.backend.model.dto.request.ManagementStockRequest;
import com.hendra.stockflow.backend.model.dto.request.ProductRequest;
import com.hendra.stockflow.backend.model.dto.response.ProductResponse;
import com.hendra.stockflow.backend.model.entity.Product;
import com.hendra.stockflow.backend.model.enums.ProductStatus;
import com.hendra.stockflow.backend.service.CategoryService;
import com.hendra.stockflow.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping("/products")
    public ResponseEntity<ProductResponse> newProduct(@RequestBody String input){
            Product newProduct = productService.createProduct(input);
            return new ResponseEntity<>( ProductResponse.builder().id(newProduct.getId()).name(newProduct.getName()).price(newProduct.getPrice()).salePrice(newProduct.getSalePrice()).inStock(newProduct.getInStock()).minimumStock(newProduct.getMinimumStock()).isActive(ProductStatus.ACTIVE).category(newProduct.getCategory()).build(), HttpStatus.OK);

    }
    @GetMapping("/products/{product-id}")
    public ResponseEntity<Product> findById(@PathVariable("product-id") Long productId){
        return new ResponseEntity<>(productService.findById(productId),HttpStatus.OK);
    }

    @PutMapping("/products/{product-id}")
    public ResponseEntity<Product> updateData(@PathVariable("product-id") Long productId, @RequestBody String input){
        return new ResponseEntity<>(productService.updateData(productId,input),HttpStatus.OK);
    }

    @PatchMapping("/products/{product-id}/status")
    public ResponseEntity<Product> changeStatus(@PathVariable("product-id") Long productId){
        return new ResponseEntity<>(productService.changeStatus(productId),HttpStatus.OK);
    }

    @PutMapping("/products/{product-id}/stock")
    public ResponseEntity<Product> manageStock(@PathVariable("product-id") Long productId,@RequestBody ManagementStockRequest managementStockRequest){
        return new ResponseEntity<>(productService.stockManagement(productId,managementStockRequest),HttpStatus.OK) ;
    }
}
