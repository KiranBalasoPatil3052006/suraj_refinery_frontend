import { apiFetch } from './api';
import { Certificate } from '../types/certificate';

// ========================
// Types
// ========================

interface CreateCertificateInput {
  customerName: string;
  namePrefix?: string;
  mark: {
    line1: string;
    line2?: string;
    additionalLines?: string[];
  };
  date: string;
  fineness: string;
  printType?: 'complete' | 'values';
  photoFit?: 'cover' | 'contain';
  samplePhotoUrl?: string;
}

interface BackendCertificate {
  id?: string;
  _id?: string;
  serialNumber: string;
  customerName: string;
  namePrefix: string;
  mark: {
    line1: string;
    line2: string;
    additionalLines: string[];
  };
  date: string;
  fineness: string;
  finenessWords: string;
  printType: 'complete' | 'values';
  sampleImage?: {
    storagePath?: string;
    key?: string;
    mimeType: string;
    size: number;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ImageUploadResult {
  storagePath?: string;
  key?: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
}

interface ImageUrlResult {
  url: string;
  expiresIn: number;
}

// ========================
// Transform backend → frontend format
// ========================

function transformCertificate(backend: BackendCertificate): Certificate {
  const certId = backend._id || backend.id || '';
  let samplePhotoUrl = (backend as any).samplePhotoUrl;

  // If backend provided sampleImage or a local path, ensure samplePhotoUrl is set
  if (!samplePhotoUrl) {
    if ((backend as any).sampleImage?.url) {
      samplePhotoUrl = (backend as any).sampleImage.url;
    } else if (backend.sampleImage?.storagePath || (backend as any).sampleImage?.localPath || backend.sampleImage) {
      samplePhotoUrl = `/api/v1/certificates/${certId}/image`;
    }
  }

  return {
    id: certId,
    serialNo: backend.serialNumber,
    customerName: backend.customerName,
    namePrefix: backend.namePrefix,
    markLines: [
      backend.mark.line1,
      backend.mark.line2,
      ...backend.mark.additionalLines,
    ].filter(Boolean),
    date: backend.date,
    purity: backend.fineness,
    purityWords: backend.finenessWords,
    printType: backend.printType,
    samplePhotoUrl: samplePhotoUrl || undefined,
    photoFit: (backend as any).photoFit || 'cover',
    createdAt: backend.createdAt,
  };
}

// ========================
// Certificate CRUD
// ========================

/**
 * Create a new certificate (the "Generate Certificate" action).
 * Returns the certificate with the backend-generated serial number.
 */
export async function createCertificate(
  input: CreateCertificateInput
): Promise<Certificate> {
  const result = await apiFetch<BackendCertificate>('/api/v1/certificates', {
    method: 'POST',
    body: input,
  });

  return transformCertificate(result);
}

/**
 * Get paginated list of certificates.
 */
export async function getCertificates(params?: {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<{ certificates: Certificate[]; pagination: PaginationMeta }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.limit) queryParams.set('limit', String(params.limit));
  if (params?.search) queryParams.set('search', params.search);
  if (params?.fromDate) queryParams.set('fromDate', params.fromDate);
  if (params?.toDate) queryParams.set('toDate', params.toDate);

  const queryString = queryParams.toString();
  const url = `/api/v1/certificates${queryString ? `?${queryString}` : ''}`;

  const result = await apiFetch<
    | { certificates: BackendCertificate[]; pagination: PaginationMeta }
    | BackendCertificate[]
  >(url);

  const rawList: BackendCertificate[] = Array.isArray(result)
    ? result
    : result?.certificates || [];

  const certificates = rawList.map(transformCertificate);
  const pagination: PaginationMeta =
    (!Array.isArray(result) && result?.pagination) ||
    (result as unknown as { __meta?: PaginationMeta }).__meta || {
      page: 1,
      limit: 20,
      total: certificates.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };

  return { certificates, pagination };
}

/**
 * Get a single certificate by ID.
 */
export async function getCertificate(id: string): Promise<Certificate> {
  const result = await apiFetch<BackendCertificate>(`/api/v1/certificates/${id}`);
  return transformCertificate(result);
}

/**
 * Update a certificate (serial number is preserved).
 */
export async function updateCertificate(
  id: string,
  updates: Partial<CreateCertificateInput>
): Promise<Certificate> {
  const result = await apiFetch<BackendCertificate>(`/api/v1/certificates/${id}`, {
    method: 'PUT',
    body: updates,
  });
  return transformCertificate(result);
}

/**
 * Delete a certificate.
 */
export async function deleteCertificate(id: string): Promise<void> {
  await apiFetch(`/api/v1/certificates/${id}`, { method: 'DELETE' });
}

// ========================
// Image APIs
// ========================

/**
 * Upload a sample image for a certificate.
 */
export async function uploadCertificateImage(
  certificateId: string,
  imageFile: File
): Promise<ImageUploadResult> {
  const formData = new FormData();
  formData.append('image', imageFile);

  return apiFetch<ImageUploadResult>(`/api/v1/certificates/${certificateId}/image`, {
    method: 'POST',
    body: formData,
  });
}

/**
 * Delete a certificate's sample image.
 */
export async function deleteCertificateImage(certificateId: string): Promise<void> {
  await apiFetch(`/api/v1/certificates/${certificateId}/image`, { method: 'DELETE' });
}

/**
 * Get a presigned URL for viewing a certificate's sample image.
 */
export async function getCertificateImageUrl(certificateId: string): Promise<string> {
  const result = await apiFetch<ImageUrlResult>(`/api/v1/certificates/${certificateId}/image-url`);
  return result.url;
}
