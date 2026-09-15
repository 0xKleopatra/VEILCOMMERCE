import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Trade } from './pages/Trade';
import { Orders } from './pages/Orders';
import { EscrowPage as Escrow } from './pages/Escrow';
import { Invoices } from './pages/Invoices';
import { Financing } from './pages/Financing';
import { Compliance } from './pages/Compliance';
import { Portfolio } from './pages/Portfolio';
import { Activity } from './pages/Activity';
import { Settings } from './pages/Settings';
import { Deploy } from './pages/Deploy';
import { Landing } from './pages/Landing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="trade" element={<Trade />} />
        <Route path="orders" element={<Orders />} />
        <Route path="escrow" element={<Escrow />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="financing" element={<Financing />} />
        <Route path="compliance" element={<Compliance />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="activity" element={<Activity />} />
        <Route path="settings" element={<Settings />} />
        <Route path="deploy" element={<Deploy />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;