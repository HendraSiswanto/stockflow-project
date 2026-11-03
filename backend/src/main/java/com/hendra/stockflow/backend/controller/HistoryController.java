package com.hendra.stockflow.backend.controller;

import com.hendra.stockflow.backend.model.dto.response.HistoryResponse;
import com.hendra.stockflow.backend.model.dto.response.SummaryResponse;
import com.hendra.stockflow.backend.model.entity.History;
import com.hendra.stockflow.backend.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class HistoryController {
    @Autowired
    private HistoryService historyService;

    @GetMapping("/history")
    public ResponseEntity<List<HistoryResponse>> getAllHistory(){
        return new ResponseEntity<>(historyService.getAllHistory(), HttpStatus.OK);
    }

    @GetMapping("/history/product/{product-id}")
    public ResponseEntity<List<HistoryResponse>> getProductHistory(@PathVariable("product-id") Long productId){
        return new ResponseEntity<>(historyService.getProductHistory(productId), HttpStatus.OK);
    }
    @GetMapping("/history/summary")
    public ResponseEntity<SummaryResponse> getSummary(){
        return new ResponseEntity<>(historyService.getSummary(), HttpStatus.OK);
    }
}
