import { ProductDashboard } from './components/ProductDashboard';
import { HistoryLogs } from './components/HistoryLogs';
import { CategoryManager } from './components/CategoryManager';

function App() {
  return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
        {/* 1. Dashboard Utama & Tabel Produk */}
        <ProductDashboard />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {/* 2. Panel Manajemen Kategori */}
          <CategoryManager />

          {/* 3. Panel Audit Log Riwayat Mutasi */}
          <HistoryLogs />
        </div>
      </div>
  );
}

export default App;
