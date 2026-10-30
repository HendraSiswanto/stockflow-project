package com.hendra.stockflow.backend.service;

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

    public Product createProduct(ProductRequest productRequest){

        if (categoryRepository.findById(productRequest.getCategoryId()).isPresent()){

            Product newProduct = new Product();
            newProduct.setName(productRequest.getName());
            newProduct.setPrice(productRequest.getPrice());
            newProduct.setSalePrice(productRequest.getSalePrice());
            newProduct.setInStock(productRequest.getInStock());
            newProduct.setCategory(categoryRepository.findById(productRequest.getCategoryId()).get());
            newProduct.setMinimumStock(productRequest.getMinimumStock());
            productRepository.save(newProduct);
            return newProduct;

        }else throw new ProductException("Category not found with id :"+productRequest.getCategoryId());
    }
}
