import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ApplicationsProvider } from './context/ApplicationsContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PageContainer } from './components/layout/PageContainer';
import { HomePage } from './routes/HomePage';
import { ApplyPage } from './routes/ApplyPage';
import { DashboardPage } from './routes/DashboardPage';
import { NotFoundPage } from './routes/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ApplicationsProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            <Navbar />
            <div className="flex-1">
              <PageContainer>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/apply" element={<ApplyPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </PageContainer>
            </div>
            <Footer />
          </div>
        </ApplicationsProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
