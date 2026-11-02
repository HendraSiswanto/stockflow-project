package com.hendra.stockflow.backend.controller;

import com.hendra.stockflow.backend.model.entity.History;
import com.hendra.stockflow.backend.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class HistoryController {
    @Autowired
    private HistoryService historyService;

    @GetMapping("/history")
    public ResponseEntity<List<History>> getAllHistory(){
        return new ResponseEntity<>(historyService.getAllHistory(), HttpStatus.OK);
    }

}
