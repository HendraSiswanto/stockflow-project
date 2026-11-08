export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    salePrice: number;
    inStock: number;
    minimumStock: number;
    isActive: boolean;
    categoryName: string;
    categoryId:number;
    historyList: History[];
}

export interface History {
    id: number;
    date: string;
    type: string;
    inStock: number;
    outStock: number;
    totalStock: number;
    productStatus: string;
    description: string;
    productId: number;
    productName: string;
    productCategory: string;
}

export interface SummaryResponse {
    totalInStock: number;
    totalOutStock: number;
    totalAssetForStock: number;
}

export interface ErrorResponse {
    errorMessage: string;
}


export interface StockUpdateRequest {
    type: string;
    total: number;
    description: string;
}