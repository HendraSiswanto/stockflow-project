package com.hendra.stockflow.backend.service;

import com.hendra.stockflow.backend.model.entity.History;
import com.hendra.stockflow.backend.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistoryService {
    private final HistoryRepository historyRepository;
    @Autowired
    public HistoryService(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    public List<History> getAllHistory (){
        return historyRepository.findAll(Sort.by(Sort.Direction.DESC,"date"));
    }
}
