export type PrintType = 'complete' | 'values';
export type PhotoFit = 'cover' | 'contain';

export interface Certificate {
  id: string;
  _id?: string;
  serialNo: string;
  customerName: string;
  namePrefix: string;
  markLines: string[];
  date: string;
  purity: string; // e.g. "89.24"
  purityWords: string; // e.g. "Eight Nine Two Four"
  samplePhotoUrl?: string;
  photoFit?: PhotoFit;
  printType: PrintType;
  createdAt: string;
}

export type FilterCategory = 'all' | 'name' | 'serialNo' | 'purity';

export type ScreenView = 'create' | 'previous' | 'details' | 'preview' | 'template';
