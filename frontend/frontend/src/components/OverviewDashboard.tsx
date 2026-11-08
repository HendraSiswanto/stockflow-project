import React, { useEffect, useState } from 'react';
import { getProducts, getSummary } from '../api/productApi';
import type { Product, SummaryResponse } from '../types';

export const OverviewDashboard: React.FC = () => {
    const [topProducts, setTopProducts] = useState<Product[]>([]);
    const [summary, setSummary] = useState<SummaryResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [pData, sData] = await Promise.all([getProducts(), getSummary()]);
                setSummary(sData);
                // Batasi hanya 10 item pertama untuk efisiensi visual halaman awal
                setTopProducts(pData.slice(0, 10));
            } catch (err) {
                console.error(err);
            } finally {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    if (loading) return <div style={{ padding: '24px', color: '#64748b' }}>Memuat overview...</div>;

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>Overview Dashboard</h1>
                <p style={{ color: '#64748b', margin: 0 }}>Metrik ringkasan aset dan daftar 10 produk teratas</p>
            </div>

            {summary && (
                <div style={styles.grid}>
                    <div style={{ ...styles.card, borderLeftColor: '#10b981' }}>
                        <div style={styles.cardTitle}>Total Stok Masuk</div>
                        <div style={styles.cardValue}>{summary.totalInStock} Pcs</div>
                    </div>
                    <div style={{ ...styles.card, borderLeftColor: '#ef4444' }}>
                        <div style={styles.cardTitle}>Total Stok Keluar</div>
                        <div style={styles.cardValue}>{summary.totalOutStock} Pcs</div>
                    </div>
                    <div style={{ ...styles.card, borderLeftColor: '#3b82f6' }}>
                        <div style={styles.cardTitle}>Total Aset Stok</div>
                        <div style={styles.cardValue}>Rp {summary.totalAssetForStock.toLocaleString()}</div>
                    </div>
                </div>
            )}

            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: '24px', marginTop: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0' }}>📦 10 Produk Highlight</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={styles.th}>Nama Produk</th>
                        <th style={styles.th}>Kategori</th>
                        <th style={styles.th}>Stok Aktif</th>
                    </tr>
                    </thead>
                    <tbody>
                    {topProducts.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={styles.td}>{p.name}</td>
                            <td style={styles.td}>{p.categoryName || '-'}</td>
                            <td style={{ ...styles.td, fontWeight: '700', color: p.inStock <= p.minimumStock ? '#ef4444' : '#10b981' }}>{p.inStock} Pcs</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' },
    card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderLeft: '4px solid' },
    cardTitle: { fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' },
    cardValue: { fontSize: '24px', fontWeight: '700', color: '#0f172a' },
    th: { padding: '12px 16px', textAlign: 'left' as const, color: '#475569', fontSize: '14px', fontWeight: '600' },
    td: { padding: '12px 16px', fontSize: '14px', color: '#334155' }
};
