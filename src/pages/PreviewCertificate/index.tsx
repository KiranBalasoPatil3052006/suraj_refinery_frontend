import React from 'react';
import { Certificate } from '../../types/certificate';
import { AppHeader } from '../../components/common/AppHeader';
import { TitleBanner } from '../../components/common/TitleBanner';
import { CertificatePreview } from '../../components/certificate/CertificatePreview';

interface PreviewCertificateProps {
  certificate: Certificate;
  onBack: () => void;
  onEdit?: () => void;
  onDownload?: (cert: Certificate) => void;
  onPrint?: (cert: Certificate) => void;
}

export const PreviewCertificate: React.FC<PreviewCertificateProps> = ({
  certificate,
  onBack,
  onEdit,
  onDownload,
  onPrint,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      <AppHeader showBack={true} onBack={onBack} showHistoryButton={false} />

      <TitleBanner
        title="Certificate Preview"
        subtitle="AUTHENTICATED SAMPLE ASSAY"
      />

      <main className="w-full max-w-[430px] px-3 sm:px-4">
        <CertificatePreview
          certificate={certificate}
          onBack={onBack}
          onEdit={onEdit}
          onDownload={onDownload}
          onPrint={onPrint}
        />
      </main>
    </div>
  );
};
