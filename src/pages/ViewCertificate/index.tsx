import React from 'react';
import { Certificate } from '../../types/certificate';
import { AppHeader } from '../../components/common/AppHeader';
import { TitleBanner } from '../../components/common/TitleBanner';
import { CertificateDetails } from '../../components/certificate/CertificateDetails';

interface ViewCertificateProps {
  certificate: Certificate;
  onBack: () => void;
  onEdit: (cert: Certificate) => void;
  onPreview: (cert: Certificate) => void;
  onDownload: (cert: Certificate) => void;
  onPrint?: (cert: Certificate) => void;
}

export const ViewCertificate: React.FC<ViewCertificateProps> = ({
  certificate,
  onBack,
  onEdit,
  onPreview,
  onDownload,
  onPrint,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      <AppHeader showBack={true} onBack={onBack} showHistoryButton={false} />

      <TitleBanner
        title="Certificate Details"
        subtitle="VERIFIED ASSAY RECORD"
      />

      <main className="w-full max-w-[430px] px-3 sm:px-4">
        <CertificateDetails
          certificate={certificate}
          onBack={onBack}
          onEdit={onEdit}
          onPreview={onPreview}
          onDownload={onDownload}
          onPrint={onPrint}
        />
      </main>
    </div>
  );
};
