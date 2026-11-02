package com.hendra.stockflow.backend.model.entity;

import com.hendra.stockflow.backend.model.enums.ProductStatus;
import com.hendra.stockflow.backend.model.enums.StockActionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "history")
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @ManyToOne(fetch = FetchType.LAZY,cascade = {CascadeType.DETACH,CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH})
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Column(name = "date")
    private LocalDateTime date;
    @Column(name = "type")
    private StockActionType type;
    @Column(name = "in_stock")
    private Integer inStock;
    @Column(name = "out_stock")
    private Integer outStock;
    @Column(name = "total_stock")
    private Integer totalStock;
    @Column(name = "product_status")
    private ProductStatus productStatus;
    @Column(name = "description")
    private String description;

}
