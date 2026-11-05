import { useEffect, useState } from 'react';

interface HistoryResponse {
    id: number;
    date: string;
    type: 'IN' | 'OUT';
    inStock: number;
    outStock: number;
    totalStock: number;
    productStatus: string;
    description: string;
    productId: number;
    productName: string;
    productCategory: string;
}

export const HistoryLogs = () => {
    const [logs, setLogs] = useState<HistoryResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/api/history')
            .then(res => res.json())
            .then(data => {
                setLogs(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ padding: '24px', color: '#64748b' }}>Memuat riwayat...</div>;

    return (
        <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginTop: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Riwayat Aktivitas Stok (Audit Log)</h2>
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
                        <td style={{ padding: '12px', fontSize: '14px' }}>{log.productCategory}</td>
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
                    <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Belum ada mutasi barang.</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
};
