import axios from 'axios';
import type { Product, Category, History, SummaryResponse, StockUpdateRequest } from '../types';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- PRODUCT ENDPOINTS ---
export interface JpaPageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export const getProducts = async (page: number, size: number): Promise<JpaPageResponse<Product>> => {
    const response = await apiClient.get<JpaPageResponse<Product>>(`/products`, {
        params: {
            page: page,
            size: size
        }
    });
    return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
};

// Mengirim objek JSON utuh ke backend yang menerima @RequestBody String
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createProduct = async (data: any): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
};

// PUT /products/{id} (Update Detail Nama/Harga Produk)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateProduct = async (id: number, data: any): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
};

// PATCH /products/{id}/status (SINKRON dengan @PatchMapping Java Anda)
export const changeProductStatus = async (id: number): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}/status`);
    return response.data;
};

// PUT /products/{id}/stock (SINKRON dengan @PutMapping manageStock Anda)
export const updateStock = async (id: number, stockRequest: StockUpdateRequest): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}/stock`, stockRequest);
    return response.data;
};
export const deleteProduct = async (id: number): Promise<string> => {
    const response = await apiClient.delete<string>(`/products/${id}`);
    return response.data;
};

// --- CATEGORY ENDPOINTS ---

export const getCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
};

// FIX: Mengirim string murni tanpa bungkus objek {} agar terbaca oleh @RequestBody String di Java
export const createCategory = async (name: string): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', name, {
        headers: { 'Content-Type': 'text/plain' } // Paksa menggunakan text/plain agar Spring Boot tidak bingung
    });
    return response.data;
};

// FIX Path Variable: Sesuai dengan @DeleteMapping("/categories/{category-id}") di Java Anda
export const deleteCategory = async (id: number): Promise<string> => {
    const response = await apiClient.delete<string>(`/categories/${id}`);
    return response.data;
};


// --- HISTORY ENDPOINTS ---

export const getAllHistory = async (): Promise<History[]> => {
    const response = await apiClient.get<History[]>('/history');
    return response.data;
};

// FIX Path Variable: Sesuai dengan @getMapping("/history/product/{product-id}") di Java Anda
export const getProductHistory = async (productId: number): Promise<History[]> => {
    const response = await apiClient.get<History[]>(`/history/product/${productId}`);
    return response.data;
};

export const getSummary = async (): Promise<SummaryResponse> => {
    const response = await apiClient.get<SummaryResponse>('/history/summary');
    return response.data;
};
