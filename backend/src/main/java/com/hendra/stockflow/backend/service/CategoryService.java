package com.hendra.stockflow.backend.service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.hendra.stockflow.backend.exception.CategoryException;
import com.hendra.stockflow.backend.model.dto.request.CategoryRequest;
import com.hendra.stockflow.backend.model.dto.response.CategoryResponse;
import com.hendra.stockflow.backend.model.entity.Category;
import com.hendra.stockflow.backend.model.entity.Product;
import com.hendra.stockflow.backend.repository.CategoryRepository;
import com.hendra.stockflow.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.DataInput;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {


    private CategoryRepository categoryRepository;
    private ProductRepository productRepository;
    @Autowired
    public CategoryService(CategoryRepository categoryRepository,ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public Category createNewCategory(String input){
        ObjectMapper mapper = new ObjectMapper();
        new CategoryRequest();
        CategoryRequest categoryRequest;
        try {
            categoryRequest = mapper.readValue(input,CategoryRequest.class);
        }catch (Exception e){
            throw new CategoryException("Bad Request");
        }
        Category category = new Category();
        if (categoryRepository.findByName(categoryRequest.getName()).isPresent()){
            throw new CategoryException("Category is already initialize");
        }else {
            category.setName(categoryRequest.getName());
            categoryRepository.save(category);
        }
        return category;
    }
    public List<Category> getAllCategory(){
        return categoryRepository.findAll();
    }

      public String deleteById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryException("Category not found with id: " + categoryId));

        List<Product> productWithCategory = productRepository.findByCategoryId(categoryId);
        for (Product product : productWithCategory) {
            product.setCategory(null);
        }
        productRepository.saveAll(productWithCategory);

        categoryRepository.delete(category);
        return "Deleted Category with id : " + categoryId;
    }

    public Category updateData(Long categoryId, String input) {
        Category oldestCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryException("Category not found with id: " + categoryId));

        ObjectMapper mapper = new ObjectMapper();
        CategoryRequest categoryRequest;
        try {
            categoryRequest = mapper.readValue(input, CategoryRequest.class);
        } catch (Exception e) {
            throw new CategoryException("Bad request, there is unknown property");
        }
        oldestCategory.setName(categoryRequest.getName());
        return categoryRepository.save(oldestCategory);
    }

}
