import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ProductDashboard } from './components/ProductDashboard';
import { CategoryManager } from './components/CategoryManager';
import { HistoryLogs } from './components/HistoryLogs';

function App() {
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'history'>('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewDashboard />;
            case 'products':
                return <ProductDashboard />;
            case 'categories':
                return <CategoryManager />;
            case 'history':
                return <HistoryLogs />;
            default:
                return <OverviewDashboard />;
        }
    };

    return (
        <div style={{ display: 'flex', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            {/* Navigasi Panel Samping */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Konten Halaman Aktif di Sebelah Kanan */}
            <main style={{ flex: 1, marginLeft: '260px', padding: '40px', minWidth: 0 }}>
                {renderContent()}
            </main>
        </div>
    );
}

export default App;