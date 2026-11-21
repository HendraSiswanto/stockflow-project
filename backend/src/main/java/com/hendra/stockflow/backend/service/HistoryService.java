package com.hendra.stockflow.backend.service;

import com.hendra.stockflow.backend.exception.HistoryException;
import com.hendra.stockflow.backend.model.dto.response.HistoryResponse;
import com.hendra.stockflow.backend.model.dto.response.SummaryResponse;
import com.hendra.stockflow.backend.model.entity.History;
import com.hendra.stockflow.backend.model.enums.StockActionType;
import com.hendra.stockflow.backend.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class HistoryService {
    private final HistoryRepository historyRepository;

    @Autowired
    public HistoryService(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    public List<HistoryResponse> getAllHistory() {
        Iterator<History> iterator = historyRepository.findAll(Sort.by(Sort.Direction.DESC, "date")).stream().iterator();
        List<HistoryResponse> historyResponseList = new ArrayList<>();

        if (iterator.hasNext()){

            while (iterator.hasNext()) {
                History currentHistory = iterator.next();
                HistoryResponse historyResponse = HistoryResponse.builder().id(currentHistory.getId()).date(currentHistory.getDate()).type(currentHistory.getType()).inStock(currentHistory.getInStock()).outStock(currentHistory.getOutStock()).totalStock(currentHistory.getTotalStock()).productStatus(currentHistory.getProductStatus()).description(currentHistory.getDescription()).productId(currentHistory.getProduct() != null ? currentHistory.getProduct().getId() : null).productName(currentHistory.getProduct() != null ? currentHistory.getProduct().getName() : "Produk Dihapus").productCategory((currentHistory.getProduct() != null && currentHistory.getProduct().getCategory() != null) ? currentHistory.getProduct().getCategory().getName() : "-"
                ).build();
                historyResponseList.add(historyResponse);
            }
            return historyResponseList;
        }else throw new HistoryException("There's none of product history");

    }

    public List<HistoryResponse> getProductHistory(Long productId){

        Iterator<History> iterator = historyRepository.findAllByProductId(productId).stream().iterator();
        List<HistoryResponse> historyResponseList = new ArrayList<>();

        if (iterator.hasNext()){
        while (iterator.hasNext()) {
            History currentHistory = iterator.next();
            HistoryResponse historyResponse = HistoryResponse.builder().id(currentHistory.getId()).date(currentHistory.getDate()).type(currentHistory.getType()).inStock(currentHistory.getInStock()).outStock(currentHistory.getOutStock()).totalStock(currentHistory.getTotalStock()).productStatus(currentHistory.getProductStatus()).description(currentHistory.getDescription()).productId(currentHistory.getProduct() != null ? currentHistory.getProduct().getId() : null).productName(currentHistory.getProduct() != null ? currentHistory.getProduct().getName() : "Produk Dihapus").productCategory((currentHistory.getProduct() != null && currentHistory.getProduct().getCategory() != null) ? currentHistory.getProduct().getCategory().getName() : "-"
            ).build();
            historyResponseList.add(historyResponse);

        }
            return historyResponseList;
        }else throw new HistoryException("There's none of product history");
    }

    public SummaryResponse getSummary(){
        List<History> allIn = historyRepository.findByType(StockActionType.IN);
        List<History> allOut = historyRepository.findByType(StockActionType.OUT);

        Long allInQuantity = allIn.stream().mapToLong(History::getInStock).sum();
        Long allOutQuantity = allOut.stream().mapToLong(History::getOutStock).sum();

        Double sumPrice = allIn.stream().mapToDouble(history -> history.getProduct().getPrice() * history.getInStock()).sum() - allOut.stream().mapToDouble(history -> history.getProduct().getPrice() *history.getOutStock() ).sum();

        return SummaryResponse.builder().totalInStock(allInQuantity).totalOutStock(allOutQuantity).totalAssetForStock(sumPrice).build();
    }
}
