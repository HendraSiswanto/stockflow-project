import React from 'react';

interface SidebarProps {
    activeTab: 'overview' | 'products' | 'categories' | 'history';
    setActiveTab: (tab: 'overview' | 'products' | 'categories' | 'history') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menus: { id: typeof activeTab; label: string; icon: string }[] = [
        { id: 'overview', label: 'Overview Dashboard', icon: '📊' },
        { id: 'products', label: 'Master Produk', icon: '📦' },
        { id: 'categories', label: 'Manajemen Kategori', icon: '🗂️' },
        { id: 'history', label: 'Log Riwayat Mutasi', icon: '🕒' },
    ];

    return (
        <div style={styles.sidebar}>
            <div style={styles.brand}>
                <span style={{ fontSize: '24px', marginRight: '8px' }}>⚡</span>
                <h2 style={styles.brandText}>StockFlow</h2>
            </div>
            <nav style={styles.nav}>
                {menus.map((menu) => {
                    const isActive = activeTab === menu.id;
                    return (
                        <button
                            key={menu.id}
                            onClick={() => setActiveTab(menu.id)}
                            style={{
                                ...styles.navLink,
                                backgroundColor: isActive ? '#3b82f6' : 'transparent',
                                color: isActive ? '#ffffff' : '#475569',
                                fontWeight: isActive ? '600' : '500',
                            }}
                        >
                            <span style={{ marginRight: '12px' }}>{menu.icon}</span>
                            {menu.label}
                        </button>
                    );
                })}
            </nav>
            <div style={styles.footer}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>BCA POS Project v1.0</span>
            </div>
        </div>
    );
};

const styles = {
    sidebar: { width: '260px', backgroundColor: '#ffffff', height: '100vh', position: 'fixed' as const, left: 0, top: 0, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' as const, zIndex: 10 },
    brand: { padding: '24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9' },
    brandText: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 },
    nav: { padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column' as const, gap: '8px' },
    navLink: { display: 'flex', alignItems: 'center', width: '100%', padding: '12px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' as const, fontSize: '14px', transition: 'all 0.2s' },
    footer: { padding: '24px', borderTop: '1px solid #f1f5f9' }
};
