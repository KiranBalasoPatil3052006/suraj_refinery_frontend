import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  X,
} from 'lucide-react';

interface PhotoUploadProps {
  value?: string;
  onChange: (url?: string) => void;
  photoFit?: 'cover' | 'contain';
  onPhotoFitChange?: (fit: 'cover' | 'contain') => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
function renderPhotoFrame(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const maxDim = 1600;
  let w = sourceWidth;
  let h = sourceHeight;
  if (w > maxDim || h > maxDim) {
    if (w > h) {
      h = Math.round((h * maxDim) / w);
      w = maxDim;
    } else {
      w = Math.round((w * maxDim) / h);
      h = maxDim;
    }
  }
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, w, h);
  }
  return canvas;
}

function readAsPhotoDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = renderPhotoFrame(image, image.naturalWidth, image.naturalHeight);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Image decode failed'));
    };
    image.src = objectUrl;
  });
}

/**
 * Photo input with two intentionally separate flows:
 * - Gallery uses a normal file picker.
 * - Camera opens getUserMedia in an in-app capture dialog. The old hidden
 *   input with capture="environment" is only a browser hint and does not
 *   reliably open a camera, especially on desktop browsers.
 */
export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  value,
  onChange,
  photoFit = 'cover',
  onPhotoFitChange,
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string>();
  const [uploadError, setUploadError] = useState<string>();

  // Sample items for quick testing in UI mode
  const sampleItems = [
    {
      name: 'Silver Chain',
      url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Silver Anklet',
      url: 'https://images.unsplash.com/photo-1611591475885-ad03fd236d6a?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Silver Plate',
      url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80',
    },
  ];

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (!isCameraOpen) return;

    let cancelled = false;

    const startCamera = async () => {
      setIsStartingCamera(true);
      setCameraError(undefined);

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          window.isSecureContext
            ? 'This browser does not support live camera access. Use Gallery instead.'
            : 'Camera access requires HTTPS or localhost. Use Gallery instead, or open the app over a secure connection.'
        );
        setIsStartingCamera(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (error) {
        if (cancelled) return;

        const errorName = error instanceof DOMException ? error.name : '';
        const message =
          errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError'
            ? 'Camera permission was blocked. Allow camera access for this site, then try again.'
            : errorName === 'NotFoundError'
              ? 'No camera was found on this device.'
              : errorName === 'NotReadableError'
                ? 'The camera is already being used by another app.'
                : 'The camera could not be opened. Check the browser permission and try again.';
        setCameraError(message);
        stopCamera();
      } finally {
        if (!cancelled) setIsStartingCamera(false);
      }
    };

    void startCamera();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [isCameraOpen, stopCamera]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const handleFile = async (file?: File) => {
    setUploadError(undefined);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('The photo is larger than 5MB. Please choose a smaller image.');
      return;
    }

    try {
      onChange(await readAsPhotoDataUrl(file));
    } catch {
      setUploadError('The photo could not be read. Please try again.');
    }
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const openCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadError(undefined);
    setCameraError(undefined);
    if (!navigator.mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    setCameraError(undefined);
  };

  const openGallery = (e: React.MouseEvent) => {
    e.stopPropagation();
    galleryInputRef.current?.click();
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      setCameraError('The camera is still starting. Please wait a moment and try again.');
      return;
    }

    const canvas = renderPhotoFrame(video, video.videoWidth, video.videoHeight);
    onChange(canvas.toDataURL('image/jpeg', 0.92));
    closeCamera();
  };

  const cameraDialog = isCameraOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="camera-dialog-title"
        className="w-full max-w-md overflow-hidden rounded-2xl bg-slate-950 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
          <div>
            <h2 id="camera-dialog-title" className="text-sm font-semibold">Take a sample photo</h2>
            <p className="mt-0.5 text-[11px] text-slate-400">Turn the phone sideways and keep the sample inside the frame</p>
          </div>
          <button
            type="button"
            onClick={closeCamera}
            aria-label="Close camera"
            className="rounded-full p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative aspect-video bg-slate-900">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          {isStartingCamera && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white">
              Opening camera…
            </div>
          )}
          {cameraError && (
            <div className="absolute inset-x-4 bottom-4 rounded-xl bg-red-950/90 px-3 py-2.5 text-xs leading-relaxed text-red-100">
              <p>{cameraError}</p>
              <button
                type="button"
                onClick={() => {
                  cameraInputRef.current?.click();
                  closeCamera();
                }}
                className="mt-2 font-semibold text-white underline underline-offset-2"
              >
                Use device camera picker
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 px-4 py-3.5 border-t border-white/10">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={closeCamera}
              className="flex-1 rounded-xl border border-white/20 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={capturePhoto}
              disabled={isStartingCamera || Boolean(cameraError)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              Capture photo
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              closeCamera();
              cameraInputRef.current?.click();
            }}
            className="w-full text-center text-[11px] text-amber-300 hover:text-amber-200 py-1 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Or use Device Camera App (Auto-focus & Flash)</span>
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-start justify-between">
        <label className="pt-2 text-[13px] font-semibold text-slate-800">
          Sample <br /> Photo
        </label>

        <div className="w-[72%] sm:w-[75%]">
          {/* Fallback camera input for browsers without getUserMedia support. */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleCameraChange}
          />

          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleGalleryChange}
          />

          {!value ? (
            <div
              onClick={openGallery}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`w-full cursor-pointer rounded-xl border-2 border-dashed px-3 py-5 transition-all duration-200 ${
                isHovered
                  ? 'border-brand-700 bg-brand-50/40'
                  : 'border-slate-300 bg-slate-50/40 hover:bg-slate-50/80'
              } flex flex-col items-center justify-center`}
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-800 text-white shadow-sm">
                <UploadCloud className="h-5 w-5" />
              </div>

              <span className="text-center text-[13px] font-semibold text-slate-700">
                Tap to upload or take a photo
              </span>
              <span className="mt-0.5 text-[10px] text-slate-400">JPG, PNG (Max 5MB)</span>

              <div className="mt-3 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={openCamera}
                  className="flex items-center space-x-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-brand-500 hover:bg-brand-50 hover:text-brand-900 active:scale-95"
                >
                  <Camera className="h-3.5 w-3.5 text-brand-700" />
                  <span>Camera</span>
                </button>
                <button
                  type="button"
                  onClick={openGallery}
                  className="flex items-center space-x-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-brand-500 hover:bg-brand-50 hover:text-brand-900 active:scale-95"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-brand-700" />
                  <span>Gallery</span>
                </button>
              </div>

              <div
                className="mt-2.5 flex items-center space-x-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[9px] text-slate-400">Sample:</span>
                {sampleItems.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => onChange(item.url)}
                    className="text-[9px] font-medium text-brand-700 underline hover:text-brand-900"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative flex w-full items-center space-x-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-1">
                <img src={value} alt="Sample item preview" className="max-h-full max-w-full object-contain rounded" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1 text-xs font-semibold text-teal-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Photo Attached</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-slate-500">Placed in certificate rectangle box</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={openCamera}
                      className="flex items-center space-x-1 text-[11px] font-semibold text-brand-700 hover:text-brand-900 hover:underline transition-colors cursor-pointer"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>Retake</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange(undefined)}
                      className="flex items-center space-x-1 text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  {onPhotoFitChange && (
                    <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-medium border border-slate-200">
                      <button
                        type="button"
                        onClick={() => onPhotoFitChange('cover')}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          photoFit !== 'contain'
                            ? 'bg-brand-900 text-white font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Fill Box
                      </button>
                      <button
                        type="button"
                        onClick={() => onPhotoFitChange('contain')}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          photoFit === 'contain'
                            ? 'bg-brand-900 text-white font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Fit Inside
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {uploadError && <p className="mt-1 text-right text-[11px] text-red-600">{uploadError}</p>}
        </div>
      </div>

      {typeof document !== 'undefined' && createPortal(cameraDialog, document.body)}
    </div>
  );
};
