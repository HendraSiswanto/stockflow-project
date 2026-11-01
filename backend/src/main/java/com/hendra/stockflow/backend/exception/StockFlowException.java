package com.hendra.stockflow.backend.exception;

import com.hendra.stockflow.backend.model.dto.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class StockFlowException{

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleCategoryException(CategoryException exc){
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setErrorMessage(exc.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleProductException(ProductException exc){
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setErrorMessage(exc.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}
