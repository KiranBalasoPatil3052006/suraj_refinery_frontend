import { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { Certificate, ScreenView } from './types/certificate';
import { MOCK_CERTIFICATES } from './constants/mockCertificates';
import { Login } from './pages/Login';
import { isAuthenticated, clearToken } from './services/api';
import * as certificateApi from './services/certificateApi';
import { CreateCertificate } from './pages/CreateCertificate';
import { PreviousCertificates } from './pages/PreviousCertificates';
import { ViewCertificate } from './pages/ViewCertificate';
import { PreviewCertificate } from './pages/PreviewCertificate';
import { CompleteCertificate } from './components/certificate/CompleteCertificate';
import { generateCertificatePDF } from './utils/pdfGenerator';
import { printCertificate } from './utils/printCertificate';
import { usePwaInstall } from './hooks/usePwaInstall';
import { Smartphone, Monitor, CheckCircle, Info, Loader2, LogOut, Download, Sliders } from 'lucide-react';
import { StoreSettingsModal } from './components/common/StoreSettingsModal';
import { SidebarBottomSheet } from './components/common/SidebarBottomSheet';

export default function App() {
  const { isInstallable, installApp } = usePwaInstall();

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const [currentScreen, setCurrentScreen] = useState<ScreenView>('create');
  const [certificates, setCertificates] = useState<Certificate[]>(MOCK_CERTIFICATES);
  const [activeCertificate, setActiveCertificate] = useState<Certificate>(MOCK_CERTIFICATES[0]);
  const [editingCertificate, setEditingCertificate] = useState<Partial<Certificate> | undefined>(undefined);
  
  // Target certificate for PDF export
  const [pdfTargetCert, setPdfTargetCert] = useState<Certificate>(MOCK_CERTIFICATES[0]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Desktop viewport preview toggle
  const [viewMode, setViewMode] = useState<'mobile-frame' | 'responsive'>('mobile-frame');

  // Static Store Settings Modal (Laptop-only action)
  const [isStoreSettingsOpen, setIsStoreSettingsOpen] = useState(false);

  // Sidebar Menu Bottom Sheet Drawer
  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);

  // UI Toast notification
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'info' | 'success' } | null>(null);

  const showToast = (title: string, desc: string, type: 'info' | 'success' = 'info') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Fetch certificates from backend on login
  const fetchCertificates = useCallback(async () => {
    try {
      const result = await certificateApi.getCertificates({ limit: 100 });
      if (result.certificates.length > 0) {
        setCertificates(result.certificates);
        setActiveCertificate(result.certificates[0]);
        setPdfTargetCert(result.certificates[0]);
      }
    } catch (err) {
      console.warn('Failed to fetch certificates from backend, using local data:', err);
      // Keep existing local/mock data as fallback
    }
  }, []);

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
  };

  // Listen for auth:logout events (triggered by 401 responses)
  useEffect(() => {
    const handleAuthLogout = () => {
      clearToken();
      setIsLoggedIn(false);
    };
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  // Fetch certificates when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchCertificates();
    }
  }, [isLoggedIn, fetchCertificates]);

  // Login handler
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Show login page if not authenticated
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Robust universal PDF generation
  const handleDownloadPDF = async (cert: Certificate) => {
    // The export always uses the unscaled canonical canvas. Capturing the
    // visible preview leaves html2canvas in a phone-sized layout context.
    flushSync(() => setPdfTargetCert(cert));
    setIsGeneratingPdf(true);
    showToast('Generating PDF', `Rendering certificate #${cert.serialNo || '0100'}...`, 'info');

    try {
      await generateCertificatePDF(
        'offscreen-certificate-canvas',
        `SBA-Certificate-${cert.serialNo || '0100'}.pdf`
      );
      showToast('Download Ready', `Certificate #${cert.serialNo} downloaded successfully!`, 'success');
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('PDF Error', 'Failed to generate PDF. Please try again.', 'info');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Robust universal print handler (A4 sheet with A5 top-half)
  const handlePrintCertificate = async (cert: Certificate) => {
    flushSync(() => setPdfTargetCert(cert));
    showToast('Preparing Print', `Formatting certificate #${cert.serialNo || '0100'} for printing...`, 'info');

    try {
      await printCertificate('offscreen-certificate-canvas');
    } catch (err) {
      console.error('Print error:', err);
      showToast('Print Error', 'Failed to open print dialog. Please try again.', 'info');
    }
  };

  // Navigation handlers
  const handleNavigateHistory = () => {
    setCurrentScreen('previous');
  };

  const handleNavigateCreate = () => {
    setEditingCertificate(undefined);
    setCurrentScreen('create');
  };

  const handleViewCertificate = (cert: Certificate) => {
    setActiveCertificate(cert);
    setCurrentScreen('details');
  };

  const handlePreviewCertificate = (cert: Certificate) => {
    setActiveCertificate(cert);
    setCurrentScreen('preview');
  };

  const handleEditCertificate = (cert: Certificate) => {
    setEditingCertificate(cert);
    setCurrentScreen('create');
  };

  const handleGenerateSuccess = async (newCert: Certificate) => {
    setCertificates((prev) => [newCert, ...prev]);
    setActiveCertificate(newCert);
    setPdfTargetCert(newCert);

    showToast(
      'Certificate Generated',
      `Serial #${newCert.serialNo} created successfully. Choose Print or Download PDF below.`,
      'success'
    );

    setCurrentScreen('preview');
  };

  return (
    <div className="min-h-screen supports-[height:100dvh]:min-h-[100dvh] bg-[#eaeff1] text-slate-800 flex flex-col items-center justify-start sm:py-6 font-sans">
      {/* Offscreen element with positive coordinates for reliable background PDF rendering */}
      <div
        id="offscreen-render-host"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '1200px',
          height: '800px',
          pointerEvents: 'none',
          zIndex: -9999,
          opacity: 0,
          overflow: 'hidden',
        }}
      >
        <CompleteCertificate
          certificate={pdfTargetCert}
          id="offscreen-certificate-canvas"
          isPdfCapture={true}
        />
      </div>

      {/* Desktop Responsive Toolbar (Visible on screens >= md) */}
      <aside className="hidden md:flex items-center justify-between w-full max-w-2xl px-4 py-2 mb-3 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center space-x-2 text-slate-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-serif font-bold text-brand-900">SURAJ BULLION ACCESSORIES</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 font-normal">Mobile-First UI</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('mobile-frame')}
              className={`px-2.5 py-1 rounded-md flex items-center space-x-1 transition-all cursor-pointer ${
                viewMode === 'mobile-frame'
                  ? 'bg-white text-brand-900 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Frame</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('responsive')}
              className={`px-2.5 py-1 rounded-md flex items-center space-x-1 transition-all cursor-pointer ${
                viewMode === 'responsive'
                  ? 'bg-white text-brand-900 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Responsive</span>
            </button>
          </div>

          {/* PWA Install Button if available */}
          {isInstallable && (
            <button
              type="button"
              onClick={installApp}
              className="px-2.5 py-1 bg-brand-800 hover:bg-brand-850 text-white font-semibold text-xs rounded-lg flex items-center space-x-1 shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Install SBA Silver Progressive Web App"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          {/* Laptop-Only Button: Edit Certificate Static Content & Store Details */}
          <button
            type="button"
            onClick={() => setIsStoreSettingsOpen(true)}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 hover:border-brand-500 text-brand-900 font-semibold text-xs rounded-lg flex items-center space-x-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Edit static store details, phone, address, and certificate labels"
          >
            <Sliders className="w-3.5 h-3.5 text-brand-800" />
            <span>Edit Store Content</span>
          </button>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer flex items-center gap-1 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main App Container */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          viewMode === 'mobile-frame'
            ? 'max-w-[430px] bg-slate-50 min-h-screen supports-[height:100dvh]:min-h-[100dvh] sm:min-h-[890px] sm:max-h-[920px] sm:overflow-y-auto sm:rounded-[40px] sm:shadow-phone sm:border-[8px] sm:border-slate-800/90 relative'
            : 'max-w-xl bg-slate-50 min-h-screen supports-[height:100dvh]:min-h-[100dvh] sm:rounded-2xl sm:shadow-lg sm:border border-slate-200'
        }`}
      >
        {/* Mobile PWA Install Banner (When visited on mobile Chrome) */}
        {isInstallable && (
          <div className="md:hidden bg-brand-850 text-white px-3.5 py-2 flex items-center justify-between text-xs z-10 border-b border-brand-700 select-none">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-medium text-[11.5px]">Install SBA App on your device</span>
            </div>
            <button
              type="button"
              onClick={installApp}
              className="px-2.5 py-1 bg-white text-brand-900 font-bold rounded-lg text-[10.5px] shadow-xs active:scale-95 cursor-pointer flex items-center space-x-1"
            >
              <Download className="w-3 h-3 text-brand-850" />
              <span>Install</span>
            </button>
          </div>
        )}

        {/* Screen Switching Router */}
        <div className="w-full min-h-full flex-1 flex flex-col relative">
          {currentScreen === 'create' && (
            <CreateCertificate
              initialData={editingCertificate}
              onNavigateHistory={handleNavigateHistory}
              onPreview={handlePreviewCertificate}
              onGenerateSuccess={handleGenerateSuccess}
              historyCount={certificates.length}
              onOpenMenu={() => setIsSidebarMenuOpen(true)}
            />
          )}

          {currentScreen === 'previous' && (
            <PreviousCertificates
              certificates={certificates}
              onBack={handleNavigateCreate}
              onViewCertificate={handleViewCertificate}
              onDownloadCertificate={handleDownloadPDF}
              onPrintCertificate={handlePrintCertificate}
            />
          )}

          {currentScreen === 'details' && (
            <ViewCertificate
              certificate={activeCertificate}
              onBack={handleNavigateHistory}
              onEdit={handleEditCertificate}
              onPreview={handlePreviewCertificate}
              onDownload={handleDownloadPDF}
              onPrint={handlePrintCertificate}
            />
          )}

          {currentScreen === 'preview' && (
            <PreviewCertificate
              certificate={activeCertificate}
              onBack={() => setCurrentScreen('create')}
              onEdit={() => handleEditCertificate(activeCertificate)}
              onDownload={handleDownloadPDF}
              onPrint={handlePrintCertificate}
            />
          )}
        </div>

        {/* Simulated Home Indicator Bar */}
        {viewMode === 'mobile-frame' && (
          <div className="hidden sm:flex justify-center pb-2 pt-1 pointer-events-none">
            <div className="w-32 h-1 bg-slate-400 rounded-full" />
          </div>
        )}
      </div>

      {/* Sidebar Bottom Sheet — Smoothly slides up from bottom with curved top corners */}
      <SidebarBottomSheet
        isOpen={isSidebarMenuOpen}
        onClose={() => setIsSidebarMenuOpen(false)}
        onNavigatePrevious={() => {
          setIsSidebarMenuOpen(false);
          handleNavigateHistory();
        }}
        onLogout={() => {
          setIsSidebarMenuOpen(false);
          handleLogout();
        }}
        onOpenStoreSettings={() => {
          setIsSidebarMenuOpen(false);
          setIsStoreSettingsOpen(true);
        }}
        historyCount={certificates.length}
        showStoreSettings={true}
      />

      {/* Laptop-Only Store Settings Modal */}
      <StoreSettingsModal
        isOpen={isStoreSettingsOpen}
        onClose={() => setIsStoreSettingsOpen(false)}
        onSaved={() => showToast('Settings Updated', 'Certificate static content & store details updated successfully!', 'success')}
      />

      {/* Global Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 max-w-sm mx-4 bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-elevated border border-slate-700/80 backdrop-blur-md flex items-start space-x-3 transition-all">
          <div className="mt-0.5 text-brand-400">
            {isGeneratingPdf ? (
              <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
            ) : toastMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <Info className="w-5 h-5 text-teal-400" />
            )}
          </div>
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-slate-100">{toastMessage.title}</h4>
            <p className="text-slate-300 mt-0.5 text-[11px] leading-relaxed">
              {toastMessage.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
