package com.hendra.stockflow.backend.repository;

import com.hendra.stockflow.backend.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product,Long> {

     Optional<Product> findByName(String name);
     List<Product> findByCategoryId(Long categoryId);
}
