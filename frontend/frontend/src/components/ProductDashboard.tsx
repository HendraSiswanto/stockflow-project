// src/components/ProductDashboard.tsx
import { useEffect, useState } from 'react';
import { getProducts, updateStock, getSummary } from '../api/productApi';
import { Product, SummaryResponse } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const styles: any = {
    container: {
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
    },
    header: {
        marginBottom: '32px',
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1e293b',
        margin: '0 0 8px 0',
    },
    subtitle: {
        color: '#64748b',
        margin: '0',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        borderLeft: '4px solid #cbd5e1',
    },
    cardTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '8px',
    },
    cardValue: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#0f172a',
    },
    tableContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        backgroundColor: '#f1f5f9',
        padding: '16px',
        textAlign: 'left',
        fontWeight: '600',
        color: '#475569',
        fontSize: '14px',
        borderBottom: '1px solid #e2e8f0',
    },
    td: {
        padding: '16px',
        borderBottom: '1px solid #e2e8f0',
        color: '#334155',
        fontSize: '14px',
    },
    badge: {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
    },
    button: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.2s',
        marginRight: '8px',
    },
    buttonGreen: {
        backgroundColor: '#10b981',
        color: 'white',
    },
    buttonRed: {
        backgroundColor: '#ef4444',
        color: 'white',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#64748b',
        fontSize: '18px',
    },
    error: {
        padding: '24px',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        borderRadius: '8px',
        textAlign: 'center',
    },
    empty: {
        padding: '40px',
        textAlign: 'center',
        color: '#94a3b8',
    }
};

export const ProductDashboard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [summary, setSummary] = useState<SummaryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, summaryData] = await Promise.all([
                    getProducts(),
                    getSummary()
                ]);
                setProducts(productsData);
                setSummary(summaryData);
            } catch {
                // Hapus 'err' agar tidak ada warning ESLint 'no-unused-vars'
                setError("Gagal memuat data. Pastikan Backend berjalan di port 8080.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStockChange = async (id: number, type: 'IN' | 'OUT') => {
        try {
            const stockRequest = {
                type: type,
                total: 1,
                description: `Manual ${type} via Dashboard`
            };

            await updateStock(id, stockRequest);

            // Refresh data
            const [productsData, summaryData] = await Promise.all([
                getProducts(),
                getSummary()
            ]);
            setProducts(productsData);
            setSummary(summaryData);

        } catch {
            // Hapus 'err' di sini juga
            alert("Gagal mengubah stok!");
        }
    };

    if (loading) {
        return <div style={styles.loading}>Memuat data...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>StockFlow Dashboard</h1>
                <p style={styles.subtitle}>Kelola stok barang dengan mudah dan efisien</p>
            </div>

            {summary && (
                <div style={styles.grid}>
                    <div style={{ ...styles.card, borderLeftColor: '#10b981' }}>
                        <div style={styles.cardTitle}>Total Stok Masuk</div>
                        <div style={styles.cardValue}>{summary.totalInStock}</div>
                    </div>
                    <div style={{ ...styles.card, borderLeftColor: '#ef4444' }}>
                        <div style={styles.cardTitle}>Total Stok Keluar</div>
                        <div style={styles.cardValue}>{summary.totalOutStock}</div>
                    </div>
                    <div style={{ ...styles.card, borderLeftColor: '#3b82f6' }}>
                        <div style={styles.cardTitle}>Total Aset Stok</div>
                        <div style={styles.cardValue}>Rp {summary.totalAssetForStock.toLocaleString()}</div>
                    </div>
                </div>
            )}

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>Produk</th>
                        <th style={styles.th}>Kategori</th>
                        <th style={styles.th}>Harga</th>
                        <th style={styles.th}>Stok</th>
                        <th style={styles.th}>Status</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td style={styles.td}>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{product.name}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {product.id}</div>
                            </td>
                            <td style={styles.td}>
                  <span style={{
                      ...styles.badge,
                      backgroundColor: '#dbeafe',
                      color: '#1e40af'
                  }}>
                    {product.category?.name || '-'}
                  </span>
                            </td>
                            <td style={styles.td}>
                                <div style={{ fontWeight: '500' }}>Beli: Rp {product.price.toLocaleString()}</div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>Jual: Rp {product.salePrice.toLocaleString()}</div>
                            </td>
                            <td style={styles.td}>
                                <div style={{
                                    fontWeight: '700',
                                    color: product.inStock <= product.minimumStock ? '#ef4444' : '#10b981',
                                    fontSize: '16px'
                                }}>
                                    {product.inStock}
                                </div>
                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Min: {product.minimumStock}</div>
                            </td>
                            <td style={styles.td}>
                  <span style={{
                      ...styles.badge,
                      backgroundColor: product.isActive ? '#dcfce7' : '#fee2e2',
                      color: product.isActive ? '#166534' : '#991b1b'
                  }}>
                    {product.isActive ? 'Aktif' : 'Non-Aktif'}
                  </span>
                            </td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>
                                <button
                                    onClick={() => handleStockChange(product.id, 'IN')}
                                    style={styles.buttonGreen}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                                >
                                    + Stok
                                </button>
                                <button
                                    onClick={() => handleStockChange(product.id, 'OUT')}
                                    style={styles.buttonRed}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                                >
                                    - Stok
                                </button>
                            </td>
                        </tr>
                    ))}

                    {products.length === 0 && (
                        <tr>
                            <td colSpan={6} style={styles.empty}>
                                Belum ada produk. Silakan tambahkan data via Backend/Postman.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};