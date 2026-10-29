package com.hendra.stockflow.backend.service;

import com.hendra.stockflow.backend.exception.CategoryException;
import com.hendra.stockflow.backend.model.dto.request.CategoryRequest;
import com.hendra.stockflow.backend.model.dto.response.CategoryResponse;
import com.hendra.stockflow.backend.model.entity.Category;
import com.hendra.stockflow.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category createNewCategory(CategoryRequest categoryRequest){

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

    public String deleteById(Long categoryId){
        categoryRepository.deleteById(categoryId);

            return "Deleted Category with id : " + categoryId;


    }

}
