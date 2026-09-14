import React, { useState, useMemo } from 'react';
import { Certificate, FilterCategory } from '../../types/certificate';
import { AppHeader } from '../../components/common/AppHeader';
import { TitleBanner } from '../../components/common/TitleBanner';
import { SearchAndFilter } from '../../components/common/SearchAndFilter';
import { CertificateCard } from '../../components/certificate/CertificateCard';
import { FileX } from 'lucide-react';

interface PreviousCertificatesProps {
  certificates: Certificate[];
  onBack: () => void;
  onViewCertificate: (cert: Certificate) => void;
  onDownloadCertificate: (cert: Certificate) => void;
  onPrintCertificate?: (cert: Certificate) => void;
}

export const PreviousCertificates: React.FC<PreviousCertificatesProps> = ({
  certificates,
  onBack,
  onViewCertificate,
  onDownloadCertificate,
  onPrintCertificate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  // Filter and search logic
  const filteredCertificates = useMemo(() => {
    let list = [...certificates];
    const q = searchQuery.toLowerCase().trim();

    if (!q) return list;

    return list.filter((cert) => {
      switch (activeFilter) {
        case 'name':
          return cert.customerName.toLowerCase().includes(q);
        case 'serialNo':
          return cert.serialNo.toLowerCase().includes(q);
        case 'purity':
          return cert.purity.includes(q) || cert.purityWords.toLowerCase().includes(q);
        case 'all':
        default:
          return (
            cert.customerName.toLowerCase().includes(q) ||
            cert.serialNo.toLowerCase().includes(q) ||
            cert.purity.includes(q) ||
            cert.purityWords.toLowerCase().includes(q) ||
            cert.markLines?.some((l) => l.toLowerCase().includes(q))
          );
      }
    });
  }, [certificates, searchQuery, activeFilter]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Header with Back chevron */}
      <AppHeader
        showBack={true}
        onBack={onBack}
        showHistoryButton={false}
      />

      {/* Screen Title Banner */}
      <TitleBanner
        title="Previous Certificates"
        subtitle="SEARCH, VIEW AND DOWNLOAD"
      />

      {/* Main Container */}
      <main className="w-full max-w-[430px] px-3 sm:px-4 space-y-4 pb-12">
        {/* Search Input and Filter Chips */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Certificate Cards List */}
        <div className="space-y-3 pt-1">
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onView={onViewCertificate}
                onDownload={onDownloadCertificate}
                onPrint={onPrintCertificate}
              />
            ))
          ) : (
            <div className="w-full py-12 px-4 bg-white rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <FileX className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No certificates found</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                No matching certificates found for "{searchQuery}". Try searching with another term.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="mt-2 text-xs font-semibold text-brand-700 hover:underline"
              >
                Clear search filters
              </button>
            </div>
          )}
        </div>

        {/* Counter Summary */}
        <div className="pt-2 text-center select-none">
          <span className="text-xs font-medium text-slate-500">
            Showing {filteredCertificates.length} of {certificates.length} certificates
          </span>
        </div>
      </main>
    </div>
  );
};
