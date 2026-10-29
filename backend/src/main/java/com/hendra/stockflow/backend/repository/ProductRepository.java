package com.hendra.stockflow.backend.repository;

import com.hendra.stockflow.backend.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Long> {


    List<Product> findByIsActive();
}
