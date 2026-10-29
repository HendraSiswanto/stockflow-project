package com.hendra.stockflow.backend.service;

import com.hendra.stockflow.backend.exception.ProductException;
import com.hendra.stockflow.backend.model.dto.request.ProductRequest;
import com.hendra.stockflow.backend.model.entity.Category;
import com.hendra.stockflow.backend.model.entity.Product;
import com.hendra.stockflow.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductService {

    private ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(ProductRequest productRequest){

        Optional<Product> categoryById = productRepository.findById(productRequest.getCategoryId().getId());
        if (categoryById.isPresent()){
            Product newProduct = new Product();
            newProduct.setName(productRequest.getName());
            newProduct.setPrice(productRequest.getPrice());
            newProduct.setSalePrice(productRequest.getSalePrice());
            newProduct.setInStock(productRequest.getInStock());
            newProduct.setCategory(productRequest.getCategoryId());
            productRepository.save(newProduct);
            return newProduct;
        }else {
            throw new ProductException("Category not found");
        }


    }
}
