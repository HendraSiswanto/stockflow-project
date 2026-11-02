package com.hendra.stockflow.backend.repository;

import com.hendra.stockflow.backend.model.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoryRepository extends JpaRepository<History,Long> {

}
