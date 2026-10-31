package com.hendra.stockflow.backend.controller;


import com.hendra.stockflow.backend.model.dto.request.CategoryRequest;
import com.hendra.stockflow.backend.model.dto.response.CategoryResponse;
import com.hendra.stockflow.backend.model.entity.Category;
import com.hendra.stockflow.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/categories")
    public ResponseEntity<CategoryResponse> insertCategory(@RequestBody String categoryRequest){
        Category newCategory = categoryService.createNewCategory(categoryRequest);
        CategoryResponse categoryResponse = CategoryResponse.builder().id(newCategory.getId()).name(newCategory.getName()).build();
        return new ResponseEntity<>(categoryResponse, HttpStatus.OK);
    }

    @GetMapping("/categories")
    public List<Category> getAllCategories(){
        return categoryService.getAllCategory();
    }
    @DeleteMapping("/categories/{category-id}")
    public ResponseEntity<String> deleteCategoryById(
            @PathVariable("category-id") Long categoryId){
        String deletedCategory = categoryService.deleteById(categoryId);
        return new ResponseEntity<>(deletedCategory,HttpStatus.OK);
    }
}
