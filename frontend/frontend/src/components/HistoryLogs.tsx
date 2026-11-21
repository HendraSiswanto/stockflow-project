import { useEffect, useState } from 'react';
import { getAllHistory, getProductHistory, getProducts } from '../api/productApi';
import type { History, Product } from '../types';

export const HistoryLogs = () => {
    const [logs, setLogs] = useState<History[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number>(0); // 0 = Semua Produk
    const [loading, setLoading] = useState(true);

    // 1. Ambil daftar produk untuk isi dropdown filter saat pertama kali dibuka
    useEffect(() => {
        const loadProductsDropdown = async () => {
            try {
                // Ambil hingga 100 produk untuk pilihan dropdown filter
                const pData = await getProducts(0, 100);
                const list = Array.isArray(pData?.content) ? pData.content : Array.isArray(pData) ? pData : [];
                setProducts(list);
            } catch (err) {
                console.error("Gagal memuat daftar produk untuk filter:", err);
            }
        };
        loadProductsDropdown();
    }, []);

    // 2. Ambil data history (semua atau per produk) setiap kali dropdown berubah
    useEffect(() => {
        const loadHistory = async () => {
            setLoading(true);
            try {
                const data = selectedProductId === 0
                    ? await getAllHistory()
                    : await getProductHistory(selectedProductId);

                setLogs(Array.isArray(data) ? data : []);
            } catch {
                // Menangkap HistoryException dari backend jika produk tersebut belum punya riwayat
                setLogs([]);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, [selectedProductId]);

    return (
        <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginTop: '24px' }}>
            {/* HEADER & FILTER DROPDOWN */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>
                        Riwayat Aktivitas Stok (Audit Log)
                    </h2>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                        Pantau seluruh mutasi stok masuk dan keluar barang
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Filter Produk:</label>
                    <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(Number(e.target.value))}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            color: '#1e293b',
                            backgroundColor: '#f8fafc',
                            minWidth: '200px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value={0}>Semua Produk</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name} (ID: {p.id})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* TABEL MUTASI LOG */}
            {loading ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Memuat riwayat...</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f1f5f9' }}>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#475569', fontSize: '14px' }}>Waktu</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#475569', fontSize: '14px' }}>Produk</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#475569', fontSize: '14px' }}>Kategori</th>
                        <th style={{ padding: '12px', textAlign: 'center', color: '#475569', fontSize: '14px' }}>Aksi</th>
                        <th style={{ padding: '12px', textAlign: 'right', color: '#475569', fontSize: '14px' }}>Perubahan</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#475569', fontSize: '14px', paddingLeft: '24px' }}>Keterangan</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px', fontSize: '13px', color: '#64748b' }}>
                                {new Date(log.date).toLocaleString('id-ID')}
                            </td>
                            <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{log.productName}</td>
                            <td style={{ padding: '12px', fontSize: '14px' }}>{log.productCategory || '-'}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700',
                                        backgroundColor: log.type === 'IN' ? '#dcfce7' : '#fee2e2',
                                        color: log.type === 'IN' ? '#15803d' : '#ef4444'
                                    }}>
                                        {log.type === 'IN' ? 'MASUK' : 'KELUAR'}
                                    </span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', fontSize: '14px' }}>
                                {log.type === 'IN' ? `+${log.inStock}` : `-${log.outStock}`} Pcs
                            </td>
                            <td style={{ padding: '12px', fontSize: '13px', color: '#475569', paddingLeft: '24px' }}>{log.description}</td>
                        </tr>
                    ))}
                    {logs.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                                {selectedProductId === 0
                                    ? 'Belum ada mutasi barang.'
                                    : 'Belum ada riwayat mutasi untuk produk yang dipilih.'}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
};
