import { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory } from '../api/productApi';
import axios from 'axios';
import type { Category } from '../types';

export const CategoryManager = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch {
                setError("Gagal memuat kategori.");
            } finally {
                // 👇 JIKA ESLINT REWEL DI SINI, PASANG KOMENTAR INI TEPAT DI ATASNYA:
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setLoading(false);
            }
        };

        loadCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            await createCategory(newCategoryName);
            setNewCategoryName('');
            // Memanggil ulang fungsi fetch data setelah create
            const data = await getCategories();
            setCategories(data);
        } catch {
            alert("Gagal menambahkan kategori baru!");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

        try {
            await deleteCategory(id);
            const data = await getCategories();
            setCategories(data);
        } catch {
            alert("Gagal menghapus kategori!");
        }
    };

    const handleUpdate = async (id: number) => {
        if (!editingName.trim()) return;

        try {
            await axios.put(`http://localhost:8080/api/categories/${id}`, editingName, {
                headers: { 'Content-Type': 'text/plain' }
            });
            setEditingId(null);
            setEditingName('');
            const data = await getCategories();
            setCategories(data);
        } catch {
            alert("Gagal memperbarui kategori!");
        }
    };

    const startEditing = (category: Category) => {
        setEditingId(category.id);
        setEditingName(category.name);
    };

    if (loading) return <div style={{ padding: '24px', color: '#64748b' }}>Memuat Kategori...</div>;
    if (error) return <div style={{ padding: '24px', color: '#ef4444' }}>{error}</div>;

    return (
        <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginTop: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>Master Manajemen Kategori</h2>
                <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Kelola daftar kelompok barang kos maupun kasir POS</p>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input
                    type="text"
                    placeholder="Nama Kategori Baru (misal: Cemilan, Sabun)"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    + Tambah
                </button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {categories.map((category) => (
                    <div key={category.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>

                        {editingId === category.id ? (
                            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    style={{ flex: 1, padding: '4px 8px', border: '1px solid #3b82f6', borderRadius: '4px', fontSize: '14px' }}
                                />
                                <button onClick={() => handleUpdate(category.id)} style={{ padding: '4px 10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                                    Simpan
                                </button>
                                <button onClick={() => setEditingId(null)} style={{ padding: '4px 10px', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                                    Batal
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <div>
                                    <span style={{ fontWeight: '600', color: '#334155' }}>{category.name}</span>
                                    <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '8px' }}>(ID: {category.id})</span>
                                </div>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button
                                        onClick={() => startEditing(category)}
                                        style={{ border: 'none', background: 'none', color: '#4f46e5', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                                    >
                                        Edit
                                    </button>
                                    <span style={{ color: '#cbd5e1' }}>|</span>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        style={{ border: 'none', background: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                ))}
                {categories.length === 0 && (
                    <div style={{ color: '#94a3b8', fontSize: '14px', gridColumn: '1/-1', textAlign: 'center', padding: '12px' }}>
                        Belum ada data kategori.
                    </div>
                )}
            </div>
        </div>
    );
};
