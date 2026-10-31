package com.hendra.stockflow.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hendra.stockflow.backend.exception.ProductException;
import com.hendra.stockflow.backend.model.dto.request.ProductRequest;
import com.hendra.stockflow.backend.model.entity.Category;
import com.hendra.stockflow.backend.model.entity.Product;
import com.hendra.stockflow.backend.repository.CategoryRepository;
import com.hendra.stockflow.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ProductService {

    private ProductRepository productRepository;
    private CategoryRepository categoryRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Product createProduct(String input) {
        ProductRequest productRequest;
        ObjectMapper mapper = new ObjectMapper();
        try {
            productRequest = mapper.readValue(input, ProductRequest.class);
        } catch (Exception e) {
            throw new ProductException("Bad request");
        }

        if (productRequest.getMinimumStock() == null) {
            productRequest.setMinimumStock(2);
        }

        if (categoryRepository.findById(productRequest.getCategoryId()).isPresent()) {

            if (productRepository.findByName(productRequest.getName()).isPresent()) {
                throw new ProductException("Product is already initialize");
            }
            Product newProduct = Product.builder().name(productRequest.getName()).price(productRequest.getPrice()).salePrice(productRequest.getSalePrice()).inStock(productRequest.getInStock()).minimumStock(productRequest.getMinimumStock()).category(categoryRepository.findById(productRequest.getCategoryId()).get()).build();
            productRepository.save(newProduct);
            return newProduct;

        } else throw new ProductException("Category not found with id :" + productRequest.getCategoryId());
    }
    public Product findById(Long productId){

        if (productRepository.findById(productId).isPresent()){
            return productRepository.findById(productId).get();
        }else throw new ProductException("Product with "+  productId +" not found");

    }
}
