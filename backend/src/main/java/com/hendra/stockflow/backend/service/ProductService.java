package com.hendra.stockflow.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hendra.stockflow.backend.exception.ProductException;
import com.hendra.stockflow.backend.model.dto.request.ManagementStockRequest;
import com.hendra.stockflow.backend.model.dto.request.ProductRequest;
import com.hendra.stockflow.backend.model.dto.response.ProductResponse;
import com.hendra.stockflow.backend.model.entity.Category;
import com.hendra.stockflow.backend.model.entity.History;
import com.hendra.stockflow.backend.model.entity.Product;
import com.hendra.stockflow.backend.model.enums.ProductStatus;
import com.hendra.stockflow.backend.model.enums.StockActionType;
import com.hendra.stockflow.backend.repository.CategoryRepository;
import com.hendra.stockflow.backend.repository.HistoryRepository;
import com.hendra.stockflow.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final HistoryRepository historyRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository,HistoryRepository historyRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.historyRepository = historyRepository;
    }

    public Page<ProductResponse> getAllProduct(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findAll(pageable);

        // Gunakan .map() langsung pada objek Page (JANGAN pakai .stream().collect(toList()))
        return products.map(product ->
                ProductResponse.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .price(product.getPrice())
                        .salePrice(product.getSalePrice())
                        .inStock(product.getInStock())
                        .minimumStock(product.getMinimumStock())
                        .isActive(product.getIsActive())
                        .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                        .categoryName(product.getCategory() != null ? product.getCategory().getName() : "-")
                        .build()
        );
    }

    public String deleteById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product with " + productId + " not found"));

        if (product.getHistoryList() != null && !product.getHistoryList().isEmpty()) {
            historyRepository.deleteAll(product.getHistoryList());
        }

        productRepository.delete(product);
        return "deleted products with id : " + productId;
    }

    public Product createProduct(String input) {
        ProductRequest productRequest;
        ObjectMapper mapper = new ObjectMapper();
        try {
            productRequest = mapper.readValue(input, ProductRequest.class);
        } catch (Exception e) {
            throw new ProductException("Bad request, there is unknown property");
        }

        if (productRequest.getMinimumStock() == null ) {
            productRequest.setMinimumStock(2);
        }

        if (productRepository.findByName(productRequest.getName()).isPresent()) {
            throw new ProductException("Product is already initialize");
        }

        Category category = null;
        if (productRequest.getCategoryId() != null && productRequest.getCategoryId() > 0) {
            category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new ProductException("Category not found with id :" + productRequest.getCategoryId()));
        }

        Product newProduct = Product.builder()
                .name(productRequest.getName())
                .price(productRequest.getPrice())
                .salePrice(productRequest.getSalePrice())
                .inStock(productRequest.getInStock())
                .minimumStock(productRequest.getMinimumStock())
                .category(category)
                .isActive(true)
                .build();

        return productRepository.save(newProduct);
    }
    public Product findById(Long productId){

        if (productRepository.findById(productId).isPresent()){
            return productRepository.findById(productId).get();
        }else throw new ProductException("Product with "+  productId +" not found");

    }
    public Product updateData(Long productId, String input) {
        Product oldestData = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product with " + productId + " not found"));

        ObjectMapper mapper = new ObjectMapper();
        ProductRequest productRequest;
        try {
            productRequest = mapper.readValue(input, ProductRequest.class);
        } catch (Exception e) {
            throw new ProductException("Bad request, there is unknown property");
        }

        Category category = null;
        if (productRequest.getCategoryId() != null && productRequest.getCategoryId() > 0) {
            category = categoryRepository.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new ProductException("New Category With id - " + productRequest.getCategoryId() + " Not Found"));
        }

        oldestData.setName(productRequest.getName() == null ? oldestData.getName() : productRequest.getName());
        oldestData.setPrice(productRequest.getPrice() == null ? oldestData.getPrice() : productRequest.getPrice());
        oldestData.setSalePrice(productRequest.getSalePrice() == null ? oldestData.getSalePrice() : productRequest.getSalePrice());
        oldestData.setInStock(productRequest.getInStock() == null ? oldestData.getInStock() : productRequest.getInStock());
        oldestData.setMinimumStock(productRequest.getMinimumStock() == null ? oldestData.getMinimumStock() : productRequest.getMinimumStock());
        oldestData.setIsActive(productRequest.getIsActive() == null ? oldestData.getIsActive() : productRequest.getIsActive().equals("true"));
        oldestData.setCategory(category);

        return productRepository.save(oldestData);
    }


    public Product changeStatus(Long productId){
        if (productRepository.findById(productId).isPresent()){
            Product oldStatus = productRepository.findById(productId).get();
            oldStatus.setIsActive(oldStatus.getIsActive() != true);
            productRepository.save(oldStatus);
            return oldStatus;
        }else throw new ProductException("Product with "+  productId +" not found");
    }

   public Product stockManagement(Long productId,ManagementStockRequest managementStockRequest){

        if(productRepository.findById(productId).isPresent()){

            Product oldStock = productRepository.findById(productId).get();
            Integer oldInStock = oldStock.getInStock();
            if (managementStockRequest.getType() == StockActionType.IN){
                oldStock.setInStock(oldStock.getInStock()+managementStockRequest.getTotal());
            } else if (managementStockRequest.getType() == StockActionType.OUT) {
                oldStock.setInStock(oldStock.getInStock()-managementStockRequest.getTotal());
                if (oldStock.getInStock() <= 0){
                    throw new ProductException("Product can't less or equals then 0");
                }
            }
            historyRepository.save(History.builder().product(oldStock).date(LocalDateTime.now()).type(managementStockRequest.getType()).inStock(oldInStock).outStock(managementStockRequest.getTotal()).totalStock(oldStock.getInStock()).productStatus(oldStock.getIsActive() == true? ProductStatus.ACTIVE : ProductStatus.INACTIVE).description(managementStockRequest.getDescription()).build());
            return productRepository.save(oldStock);
        }else throw new ProductException("Product with "+  productId +" not found");
    }
}
