import { Certificate } from '../types/certificate';

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-0100',
    serialNo: '0100',
    customerName: 'Lakshmi Devi',
    namePrefix: 'Mrs.',
    markLines: [
      'Silver Chain',
      'Old silver chain submitted for purity testing'
    ],
    date: '2025-09-12',
    purity: '89.24',
    purityWords: 'Eight Nine Two Four',
    printType: 'complete',
    createdAt: '2025-09-12T10:30:00Z',
    samplePhotoUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'cert-0099',
    serialNo: '0099',
    customerName: 'Meena Rani',
    namePrefix: 'Mrs.',
    markLines: [
      'Silver Anklets (Kolusu)',
      'Traditional handcrafted bridal anklet pair'
    ],
    date: '2025-09-11',
    purity: '92.50',
    purityWords: 'Nine Two Five Zero',
    printType: 'complete',
    createdAt: '2025-09-11T14:15:00Z',
    samplePhotoUrl: 'https://images.unsplash.com/photo-1611591475885-ad03fd236d6a?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'cert-0098',
    serialNo: '0098',
    customerName: 'Anitha Kumar',
    namePrefix: 'Mrs.',
    markLines: [
      'Silver Plate / Thali',
      'Pooja silver vessel item for hallmarking'
    ],
    date: '2025-09-10',
    purity: '88.76',
    purityWords: 'Eight Eight Seven Six',
    printType: 'values',
    createdAt: '2025-09-10T11:00:00Z',
    samplePhotoUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'cert-0097',
    serialNo: '0097',
    customerName: 'Radha Krishnan',
    namePrefix: 'Mrs.',
    markLines: [
      'Silver Katori & Spoon',
      'Baby feeding silver gift set'
    ],
    date: '2025-09-08',
    purity: '91.80',
    purityWords: 'Nine One Eight Zero',
    printType: 'complete',
    createdAt: '2025-09-08T16:45:00Z',
    samplePhotoUrl: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'cert-0096',
    serialNo: '0096',
    customerName: 'Sangeetha Murugan',
    namePrefix: 'Mrs.',
    markLines: [
      'Silver Idol (Ganesh)',
      'Cast solid silver idol sample testing'
    ],
    date: '2025-09-05',
    purity: '84.50',
    purityWords: 'Eight Four Five Zero',
    printType: 'values',
    createdAt: '2025-09-05T09:20:00Z',
    samplePhotoUrl: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=400&auto=format&fit=crop&q=80',
  }
];
