package com.hendra.stockflow.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hendra.stockflow.backend.exception.ProductException;
import com.hendra.stockflow.backend.model.dto.request.ManagementStockRequest;
import com.hendra.stockflow.backend.model.dto.request.ProductRequest;
import com.hendra.stockflow.backend.model.entity.Category;
import com.hendra.stockflow.backend.model.entity.Product;
import com.hendra.stockflow.backend.model.enums.StockActionType;
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
            throw new ProductException("Bad request, there is unknown property");
        }

        if (productRequest.getMinimumStock() == null ) {
            productRequest.setMinimumStock(2);
        }

        if (categoryRepository.findById(productRequest.getCategoryId()).isPresent()) {

            if (productRepository.findByName(productRequest.getName()).isPresent()) {
                throw new ProductException("Product is already initialize");
            }
            Product newProduct = Product.builder().name(productRequest.getName()).price(productRequest.getPrice()).salePrice(productRequest.getSalePrice()).inStock(productRequest.getInStock()).minimumStock(productRequest.getMinimumStock()).category(categoryRepository.findById(productRequest.getCategoryId()).get()).isActive(true).build();
            productRepository.save(newProduct);
            return newProduct;

        } else throw new ProductException("Category not found with id :" + productRequest.getCategoryId());
    }
    public Product findById(Long productId){

        if (productRepository.findById(productId).isPresent()){
            return productRepository.findById(productId).get();
        }else throw new ProductException("Product with "+  productId +" not found");

    }
    public Product updateData(Long productId,String input){

        ObjectMapper mapper = new ObjectMapper();
        ProductRequest productRequest = new ProductRequest();
        Product oldestData = productRepository.findById(productId).get();
        if (productRepository.findById(productId).isPresent()){
            try {
                System.out.println(input);
                productRequest = mapper.readValue(input,ProductRequest.class);
            }catch (Exception e){
                throw new ProductException("Bad request, there is unknown property");
            }

            if (categoryRepository.findById(productRequest.getCategoryId()).isPresent()){
              oldestData.setName(productRequest.getName() == null ? oldestData.getName(): productRequest.getName());
              oldestData.setPrice(productRequest.getPrice() == null ? oldestData.getPrice() : productRequest.getPrice());
              oldestData.setSalePrice(productRequest.getSalePrice() == null ? oldestData.getSalePrice() : productRequest.getSalePrice()) ;
              oldestData.setInStock(productRequest.getInStock() == null ? oldestData.getInStock() : productRequest.getInStock());
              oldestData.setMinimumStock(productRequest.getMinimumStock() == null? oldestData.getMinimumStock() : productRequest.getMinimumStock());
              oldestData.setCategory(categoryRepository.findById(productRequest.getCategoryId()).get()) ;
              oldestData.setIsActive(true);
            }else throw  new ProductException("New Category With id - "+productRequest.getCategoryId()+" Not Found");
            productRepository.save(oldestData);
        }

       return oldestData;
    }

    public Product changeStatus(Long productId){
        if (productRepository.findById(productId).isPresent()){
            Product oldStatus = productRepository.findById(productId).get();
            oldStatus.setIsActive(oldStatus.getIsActive() != true);
            productRepository.save(oldStatus);
            return oldStatus;
        }else throw new ProductException("Product with "+  productId +" not found");
    }

    public Product stockManagement(Long productId,String input){

        if(productRepository.findById(productId).isPresent()){
            ObjectMapper mapper = new ObjectMapper();
            Product oldStock = productRepository.findById(productId).get();
            ManagementStockRequest managementStockRequest ;
            try {
                managementStockRequest = mapper.readValue(input,ManagementStockRequest.class);
            } catch (Exception e) {
                throw new ProductException("Bad request, there is unknown property");
            }

            if (managementStockRequest.getType() == StockActionType.IN){
                oldStock.setInStock(oldStock.getInStock()+managementStockRequest.getTotal());
            } else if (managementStockRequest.getType() == StockActionType.OUT) {
                oldStock.setInStock(oldStock.getInStock()-managementStockRequest.getTotal());
                if (oldStock.getInStock() <= 0){
                    throw new ProductException("Product can't less or equals then 0");
                }
            }
            return productRepository.save(oldStock);
        }else throw new ProductException("Product with "+  productId +" not found");


    }
}
