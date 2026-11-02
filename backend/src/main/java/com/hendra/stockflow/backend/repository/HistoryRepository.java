package com.hendra.stockflow.backend.repository;

import com.hendra.stockflow.backend.model.entity.History;
import com.hendra.stockflow.backend.model.enums.StockActionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoryRepository extends JpaRepository<History,Long> {
    List<History> findAllByProductId(Long productId);
    List<History> findByType(StockActionType type);
}
