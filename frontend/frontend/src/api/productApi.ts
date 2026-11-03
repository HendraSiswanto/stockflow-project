import axios from 'axios';
import type { Product, Category, History, SummaryResponse, StockUpdateRequest } from '../types';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getProducts = async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
};

// Catatan: Sesuaikan body request dengan apa yang diterima controller backend kamu
export const createProduct = async (data: any): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
};

// PUT /products/{id} (Update Produk)
export const updateProduct = async (id: number, data: any): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
};

// PATCH /products/{id}/status (Ubah Status Aktif/Non-Aktif)
export const changeProductStatus = async (id: number): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}/status`);
    return response.data;
};

// PUT /products/{id}/stock (Update Stok)
export const updateStock = async (id: number, stockRequest: StockUpdateRequest): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}/stock`, stockRequest);
    return response.data;
};

// --- CATEGORY ENDPOINTS ---

// GET /categories
export const getCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
};

// POST /categories
export const createCategory = async (name: string): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', { name });
    return response.data;
};

// DELETE /categories/{id}
export const deleteCategory = async (id: number): Promise<string> => {
    const response = await apiClient.delete<string>(`/categories/${id}`);
    return response.data;
};

// --- HISTORY ENDPOINTS ---

// GET /history
export const getAllHistory = async (): Promise<History[]> => {
    const response = await apiClient.get<History[]>('/history');
    return response.data;
};

// GET /history/product/{id}
export const getProductHistory = async (productId: number): Promise<History[]> => {
    const response = await apiClient.get<History[]>(`/history/product/${productId}`);
    return response.data;
};

// GET /history/summary
export const getSummary = async (): Promise<SummaryResponse> => {
    const response = await apiClient.get<SummaryResponse>('/history/summary');
    return response.data;
};