import { useEffect, useState } from 'react';
import {
    getProducts,
    updateStock,
    changeProductStatus,
    createProduct,
    updateProduct,
    getCategories,
    deleteProduct
} from '../api/productApi';
import type { Product, Category } from '../types';

export const ProductDashboard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- CONTROLLER FRONTEND PAGINATION ---
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;

    // State untuk Modal Form (Tambah/Edit)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [formName, setFormName] = useState('');
    const [formPrice, setFormPrice] = useState(0);
    const [formSalePrice, setFormSalePrice] = useState(0);
    const [formInStock, setFormInStock] = useState(0);
    const [formMinStock, setFormMinStock] = useState(0);
    const [formActive, setFormActive] = useState("true");
    const [formCategoryId, setFormCategoryId] = useState<number>(0);

    const refreshAllData = async () => {
        try {
            const [productsData, categoriesData] = await Promise.all([
                getProducts(),
                getCategories()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch {
            setError("Gagal memuat data. Pastikan Backend berjalan.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refreshAllData();
    }, []);

    // Perhitungan Potong Halaman (Pagination Slicing)
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

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

    const handleToggleStatus = async (id: number) => {
        try {
            await changeProductStatus(id);
            refreshAllData();
        } catch {
            alert("Gagal mengubah status produk!");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
        try {
            await deleteProduct(id);
            refreshAllData();
        } catch {
            alert("Gagal menghapus produk!");
        }
    };

    const openAddModal = () => {
        setEditingProductId(null);
        setFormName('');
        setFormPrice(0);
        setFormSalePrice(0);
        setFormInStock(0);
        setFormMinStock(0);
        setFormActive("true");
        setFormCategoryId(categories[0]?.id || 0);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProductId(product.id);
        setFormName(product.name);
        setFormPrice(product.price);
        setFormSalePrice(product.salePrice);
        setFormInStock(product.inStock);
        setFormMinStock(product.minimumStock);
        setFormActive(product.active ? "true" : "false");
        setFormCategoryId(product.categoryId || 0);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: formName,
            price: formPrice,
            salePrice: formSalePrice,
            inStock: formInStock,
            minimumStock: formMinStock,
            isActive: formActive === "true",
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
        <div style={{ padding: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={styles.title}>Master Manajemen Produk</h1>
                    <p style={styles.subtitle}>Daftar katalog barang kos dan POS kasir</p>
                </div>
                <button onClick={openAddModal} style={styles.buttonAdd}>
                    + Tambah Produk Baru
                </button>
            </div>

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
                    {currentItems.map((product) => (
                        <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={styles.td}>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{product.name}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {product.id}</div>
                            </td>
                            <td style={styles.td}>
                                <span style={styles.badgeCategory}>{product.categoryName || '-'}</span>
                            </td>
                            <td style={styles.td}>
                                <div style={{ fontSize: '13px', fontWeight: '500' }}>Beli: Rp {product.price.toLocaleString()}</div>
                                <div style={{ fontSize: '13px', color: '#64748b' }}>Jual: Rp {product.salePrice.toLocaleString()}</div>
                            </td>
                            <td style={styles.td}>
                                <div style={{ fontWeight: '700', color: product.inStock <= product.minimumStock ? '#ef4444' : '#10b981' }}>{product.inStock}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Min: {product.minimumStock}</div>
                            </td>
                            <td style={styles.td}>
                                    <span onClick={() => handleToggleStatus(product.id)} style={{
                                        ...styles.badgeStatus,
                                        backgroundColor: product.active ? '#dcfce7' : '#fee2e2',
                                        color: product.active ? '#166534' : '#991b1b',
                                    }}>
                                        {product.active ? 'Aktif' : 'Non-Aktif'}
                                    </span>
                            </td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>
                                <button onClick={() => handleStockChange(product.id, 'IN')} style={styles.buttonGreen}>+ Stok</button>
                                <button onClick={() => handleStockChange(product.id, 'OUT')} style={styles.buttonRed}>- Stok</button>
                                <button onClick={() => openEditModal(product)} style={styles.buttonEdit}>Edit</button>
                                <button onClick={() => handleDelete(product.id)} style={styles.buttonDelete}>Hapus</button>
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

                {/* CONTROL PANEL FRONTEND PAGINATION */}
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                        Halaman <b>{currentPage + 1}</b> dari <b>{totalPages || 1}</b> (Total: {products.length} produk)
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}>◀ Prev</button>
                        <button disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => p + 1)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer' }}>Next ▶</button>
                    </div>
                </div>
            </div>

            {/* MODAL DIALOG POPUP */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700' }}>{editingProductId ? 'Edit Data Produk' : 'Tambah Produk Baru'}</h3>
                        <form onSubmit={handleFormSubmit}>
                            <label style={styles.label}>Nama Produk</label>
                            <input type="text" value={formName} onChange={e => setFormName(e.target.value)} required style={styles.input} />
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Harga Beli</label>
                                    <input type="number" value={formPrice} onChange={e => setFormPrice(Number(e.target.value))} required style={styles.input} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Harga Jual</label>
                                    <input type="number" value={formSalePrice} onChange={e => setFormSalePrice(Number(e.target.value))} required style={styles.input} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Stok Awal</label>
                                    <input type="number" value={formInStock} onChange={e => setFormInStock(Number(e.target.value))} required disabled={!!editingProductId} style={styles.input} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Min Stok</label>
                                    <input type="number" value={formMinStock} onChange={e => setFormMinStock(Number(e.target.value))} required style={styles.input} />
                                </div>
                            </div>
                            <label style={styles.label}>Pilih Status</label>
                            <select value={formActive} onChange={e => setFormActive(e.target.value)} style={styles.input}>
                                <option value="true">Aktif</option>
                                <option value="false">Non-Aktif</option>
                            </select>
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

/* eslint-disable @typescript-eslint/no-explicit-any */
const styles: any = {
    title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
    subtitle: { color: '#64748b', margin: '0' },
    tableContainer: { backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { backgroundColor: '#f8fafc', padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '14px', borderBottom: '1px solid #e2e8f0' },
    td: { padding: '16px', fontSize: '14px', color: '#334155' },
    badgeCategory: { backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '500' },
    badgeStatus: { padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
    buttonGreen: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '6px', fontWeight: '500' },
    buttonRed: { backgroundColor: '#f43f5e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '6px', fontWeight: '500' },
    buttonEdit: { backgroundColor: '#64748b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '6px', fontWeight: '500' },
    buttonDelete: { backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
    buttonAdd: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px', marginTop: '12px' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', marginTop: '2px' },
    buttonCancel: { backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
    buttonSave: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
    loading: { padding: '40px', textAlign: 'center', color: '#64748b' },
    error: { padding: '40px', textAlign: 'center', color: '#ef4444' }
};
