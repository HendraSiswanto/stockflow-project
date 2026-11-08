import { useEffect, useState } from 'react';
import {
    getProducts,
    updateStock,
    getSummary,
    changeProductStatus,
    createProduct,
    updateProduct,
    getAllHistory,
    getProductHistory,
    getCategories
} from '../api/productApi';
import type { Product, Category, History, SummaryResponse } from '../types';

export const ProductDashboard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [summary, setSummary] = useState<SummaryResponse | null>(null);
    const [history, setHistory] = useState<History[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | 'ALL'>('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State untuk Modal Form (Tambah/Edit)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [formName, setFormName] = useState('');
    const [formPrice, setFormPrice] = useState(0);
    const [formSalePrice, setFormSalePrice] = useState(0);
    const [formInStock, setFormInStock] = useState(0);
    const [formMinStock, setFormMinStock] = useState(0);
    const [formCategoryId, setFormCategoryId] = useState<number>(0);

    const refreshAllData = async () => {
        try {
            const [productsData, summaryData, categoriesData] = await Promise.all([
                getProducts(),
                getSummary(),
                getCategories()
            ]);
            setProducts(productsData);
            setSummary(summaryData);
            setCategories(categoriesData);

            // Ambil history berdasarkan filter yang terpilih
            if (selectedProductId === 'ALL') {
                const historyData = await getAllHistory();
                setHistory(historyData);
            } else {
                const historyData = await getProductHistory(selectedProductId);
                setHistory(historyData);
            }
        } catch {
            setError("Gagal memuat data. Pastikan Backend berjalan.");
        } finally {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refreshAllData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProductId]);

    // Handle Perubahan Stok (+ / -)
    const handleStockChange = async (id: number, type: 'IN' | 'OUT') => {
        try {
            await updateStock(id, {
                type: type,
                total: 1,
                description: `Manual ${type} via Dashboard`
            });
            refreshAllData();
        } catch {
            alert("Gagal mengubah stok!");
        }
    };

    // Handle Ubah Status Aktif (PATCH)
    const handleToggleStatus = async (id: number) => {
        try {
            await changeProductStatus(id);
            refreshAllData();
        } catch {
            alert("Gagal mengubah status produk!");
        }
    };

    // Pemicu Buka Modal Tambah Baru
    const openAddModal = () => {
        setEditingProductId(null);
        setFormName('');
        setFormPrice(0);
        setFormSalePrice(0);
        setFormInStock(0);
        setFormMinStock(0);
        setFormCategoryId(categories[0]?.id || 0);
        setIsModalOpen(true);
    };

    // Pemicu Buka Modal Edit (Memakai data tersemat & PUT)
    const openEditModal = (product: Product) => {
        setEditingProductId(product.id);
        setFormName(product.name);
        setFormPrice(product.price);
        setFormSalePrice(product.salePrice);
        setFormInStock(product.inStock);
        setFormMinStock(product.minimumStock);
        setFormCategoryId(product.categoryId || 0);
        setIsModalOpen(true);
    };

    // Handle Submit Form (POST / PUT)
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: formName,
            price: formPrice,
            salePrice: formSalePrice,
            inStock: formInStock,
            minimumStock: formMinStock,
            categoryId: formCategoryId
        };

        try {
            if (editingProductId) {
                await updateProduct(editingProductId, JSON.stringify(payload));
            } else {
                await createProduct(JSON.stringify(payload));
            }
            setIsModalOpen(false);
            refreshAllData();
        } catch {
            alert("Gagal menyimpan data produk!");
        }
    };

    if (loading) return <div style={styles.loading}>Memuat data...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    return (
        <div style={styles.container}>
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={styles.title}>StockFlow Dashboard</h1>
                    <p style={styles.subtitle}>Kelola stok dan pantau riwayat mutasi barang</p>
                </div>
                <button onClick={openAddModal} style={styles.buttonAdd}>
                    + Tambah Produk Baru
                </button>
            </div>

            {/* CARDS RINGKASAN */}
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

            {/* TABEL UTAMA PRODUK */}
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
                        <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={styles.td}>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{product.name}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {product.id}</div>
                            </td>
                            <td style={styles.td}>
                                <span style={styles.badgeCategory}>
                                    {product.categoryName || '-'}
                                </span>
                            </td>
                            <td style={styles.td}>
                                <div style={{ fontSize: '13px', fontWeight: '500' }}>Beli: Rp {product.price.toLocaleString()}</div>
                                <div style={{ fontSize: '13px', color: '#64748b' }}>Jual: Rp {product.salePrice.toLocaleString()}</div>
                            </td>
                            <td style={styles.td}>
                                <div style={{ fontWeight: '700', color: product.inStock <= product.minimumStock ? '#ef4444' : '#10b981' }}>
                                    {product.inStock}
                                </div>
                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Min: {product.minimumStock}</div>
                            </td>
                            <td style={styles.td}>
                                <span onClick={() => handleToggleStatus(product.id)} style={{
                                    ...styles.badgeStatus,
                                    backgroundColor: product.isActive ? '#dcfce7' : '#fee2e2',
                                    color: product.isActive ? '#166534' : '#991b1b',
                                }}>
                                    {product.isActive ? 'Aktif' : 'Non-Aktif'}
                                </span>
                            </td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>
                                <button onClick={() => handleStockChange(product.id, 'IN')} style={styles.buttonGreen}>+ Stok</button>
                                <button onClick={() => handleStockChange(product.id, 'OUT')} style={styles.buttonRed}>- Stok</button>
                                <button onClick={() => openEditModal(product)} style={styles.buttonEdit}>Edit</button>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                                Belum ada data produk. Klik "+ Tambah Produk Baru" untuk mengisi.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* PANEL AUDIT LOG RIWAYAT MUTASI */}
            <div style={{ ...styles.tableContainer, marginTop: '40px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Log Riwayat Aktivitas Barang</h2>

                    <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                        style={styles.select}
                    >
                        <option value="ALL">Semua Produk</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>

                <table style={styles.table}>
                    <thead>
                    <tr style={{ backgroundColor: '#f8fafc' }}>
                        <th style={styles.th}>Waktu</th>
                        <th style={styles.th}>Nama Barang</th>
                        <th style={styles.th}>Tipe</th>
                        <th style={styles.th}>Jumlah</th>
                        <th style={styles.th}>Keterangan</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history.map((h) => (
                        <tr key={h.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={styles.td}>{new Date(h.date).toLocaleString('id-ID')}</td>
                            <td style={{ ...styles.td, fontWeight: '600' }}>{h.productName}</td>
                            <td style={styles.td}>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700',
                                        backgroundColor: h.type === 'IN' ? '#dcfce7' : '#fee2e2',
                                        color: h.type === 'IN' ? '#15803d' : '#ef4444'
                                    }}>{h.type}</span>
                            </td>
                            <td style={{ ...styles.td, fontWeight: '700' }}>
                                {h.type === 'IN' ? h.inStock : h.outStock} Pcs
                            </td>
                            <td style={styles.td}>{h.description}</td>
                        </tr>
                    ))}
                    {history.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                                Tidak ada catatan riwayat mutasi untuk filter ini.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* MODAL DIALOG POPUP (FORM TAMBAH / EDIT) */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700' }}>
                            {editingProductId ? 'Edit Data Produk' : 'Tambah Produk Baru'}
                        </h3>
                        <form onSubmit={handleFormSubmit}>
                            <label style={styles.label}>Nama Produk</label>
                            <input type="text" value={formName} onChange={e => setFormName(e.target.value)} required style={styles.input} />

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Harga Beli (Rp)</label>
                                    <input type="number" value={formPrice} onChange={e => setFormPrice(Number(e.target.value))} required style={styles.input} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Harga Jual (Rp)</label>
                                    <input type="number" value={formSalePrice} onChange={e => setFormSalePrice(Number(e.target.value))} required style={styles.input} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Stok Awal</label>
                                    <input type="number" value={formInStock} onChange={e => setFormInStock(Number(e.target.value))} required disabled={!!editingProductId} style={styles.input} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Batas Minimum Stok</label>
                                    <input type="number" value={formMinStock} onChange={e => setFormMinStock(Number(e.target.value))} required style={styles.input} />
                                </div>
                            </div>

                            <label style={styles.label}>Pilih Kategori</label>
                            <select value={formCategoryId} onChange={e => setFormCategoryId(Number(e.target.value))} style={styles.input}>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.buttonCancel}>Batal</button>
                                <button type="submit" style={styles.buttonSave}>Simpan Data</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLES OBJECT ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const styles: any = {
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' },
    title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
    subtitle: { color: '#64748b', margin: '0' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' },
    card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderLeft: '4px solid' },
    cardTitle: { fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' },
    cardValue: { fontSize: '24px', fontWeight: '700', color: '#0f172a' },
    tableContainer: { backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { backgroundColor: '#f1f5f9', padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '14px' },
    td: { padding: '16px', fontSize: '14px', color: '#334155' },
    badgeCategory: { backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '500' },
    badgeStatus: { padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
    buttonGreen: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '6px' },
    buttonRed: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '6px' },
    buttonEdit: { backgroundColor: '#64748b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
    buttonAdd: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
    select: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px', marginTop: '12px' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' },
    buttonCancel: { backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
    buttonSave: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
    loading: { padding: '40px', textAlign: 'center', color: '#64748b' },
    error: { padding: '40px', textAlign: 'center', color: '#ef4444' }
};
