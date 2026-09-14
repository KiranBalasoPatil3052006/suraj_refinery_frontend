import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Building2, Phone, MapPin, Tag, Sparkles, Type, ZoomIn } from 'lucide-react';
import { useStoreSettings, StoreSettings } from '../../context/StoreSettingsContext';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const { settings, updateSettings, resetSettings } = useStoreSettings();
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [activeTab, setActiveTab] = useState<'store' | 'contact' | 'labels' | 'fonts'>('store');

  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleChange = (field: keyof StoreSettings, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberChange = (field: keyof StoreSettings, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    if (onSaved) onSaved();
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Reset all store content, labels and font sizes back to factory defaults?')) {
      resetSettings();
      onClose();
    }
  };

  const scaleOptions = [90, 100, 105, 110, 115, 120, 125, 130];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-elevated border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between select-none">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-850 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Certificate Static Content & Font Sizing</h3>
              <p className="text-xs text-slate-500">Customize store details, labels, and text sizes</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 pt-2 bg-white text-sm font-semibold text-slate-600 gap-5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'store'
                ? 'border-brand-800 text-brand-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Store & Titles</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'contact'
                ? 'border-brand-800 text-brand-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Contact & Address</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('labels')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'labels'
                ? 'border-brand-800 text-brand-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Labels & Slogans</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fonts')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'fonts'
                ? 'border-brand-800 text-brand-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Type className="w-4 h-4 text-emerald-600" />
            <span>Font Sizes & Scale</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'store' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Tamil Store Title
                </label>
                <input
                  type="text"
                  value={formData.tamilTitle}
                  onChange={(e) => handleChange('tamilTitle', e.target.value)}
                  placeholder="சூராஜ் புல்லியன் அசெசரீஸ்"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  English Store Title
                </label>
                <input
                  type="text"
                  value={formData.englishTitle}
                  onChange={(e) => handleChange('englishTitle', e.target.value)}
                  placeholder="SURAJ BULLION ACCESSORIES"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Certificate Header Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="SILVER SAMPLE CERTIFICATE"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Top Tagline (Header)
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="A TRUSTED QUALITY IN SILVER"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-brand-700" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-brand-700" />
                  <span>Address Line 1</span>
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleChange('addressLine1', e.target.value)}
                  placeholder="WAT, Ranganai Road,"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleChange('addressLine2', e.target.value)}
                  placeholder="Singanallur, Coimbatore - 2"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'labels' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Customer Label
                  </label>
                  <input
                    type="text"
                    value={formData.nameLabel}
                    onChange={(e) => handleChange('nameLabel', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Mark Label
                  </label>
                  <input
                    type="text"
                    value={formData.markLabel}
                    onChange={(e) => handleChange('markLabel', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Serial No Label
                  </label>
                  <input
                    type="text"
                    value={formData.serialNoLabel}
                    onChange={(e) => handleChange('serialNoLabel', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Date Label
                  </label>
                  <input
                    type="text"
                    value={formData.dateLabel}
                    onChange={(e) => handleChange('dateLabel', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Fineness / Purity Label
                  </label>
                  <input
                    type="text"
                    value={formData.finenessLabel}
                    onChange={(e) => handleChange('finenessLabel', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Proprietor Signature Label
                  </label>
                  <input
                    type="text"
                    value={formData.proprietorLabel}
                    onChange={(e) => handleChange('proprietorLabel', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Bottom Slogan
                </label>
                <input
                  type="text"
                  value={formData.bottomSlogan}
                  onChange={(e) => handleChange('bottomSlogan', e.target.value)}
                  placeholder="PURITY BUILDS TRUST"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'fonts' && (
            <div className="space-y-6">
              {/* Overall Font Scale Control */}
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ZoomIn className="w-5 h-5 text-brand-800" />
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">
                        Overall Certificate Font Scale
                      </span>
                      <span className="text-xs text-slate-500">
                        Increases or decreases all text sizes across the certificate proportionally
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-brand-800 text-white font-mono font-bold text-xs rounded-lg">
                    {formData.overallFontScale || 100}%
                  </span>
                </div>

                {/* Quick Scale Preset Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {scaleOptions.map((scale) => (
                    <button
                      key={scale}
                      type="button"
                      onClick={() => handleNumberChange('overallFontScale', scale)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        (formData.overallFontScale || 100) === scale
                          ? 'bg-brand-800 text-white border-brand-800 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {scale === 100 ? '100% (Default)' : `${scale}%`}
                    </button>
                  ))}
                </div>

                {/* Range Slider */}
                <div className="pt-2">
                  <input
                    type="range"
                    min="90"
                    max="130"
                    step="5"
                    value={formData.overallFontScale || 100}
                    onChange={(e) => handleNumberChange('overallFontScale', parseInt(e.target.value, 10))}
                    className="w-full accent-brand-800 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                    <span>90% (Compact)</span>
                    <span>100% (Normal)</span>
                    <span>115% (Large)</span>
                    <span>130% (Extra Large)</span>
                  </div>
                </div>
              </div>

              {/* Individual Element Font Sizes */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Specific Field Font Sizes (in Pixels)
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  {/* Tamil Title Font Size */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tamil Store Title (px)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="18"
                        max="40"
                        value={formData.tamilTitleFontSize || 28}
                        onChange={(e) => handleNumberChange('tamilTitleFontSize', parseInt(e.target.value, 10))}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 font-mono"
                      />
                      <span className="text-xs text-slate-400">px</span>
                    </div>
                  </div>

                  {/* English Title Font Size */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      English Store Title (px)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="18"
                        max="38"
                        value={formData.englishTitleFontSize || 26}
                        onChange={(e) => handleNumberChange('englishTitleFontSize', parseInt(e.target.value, 10))}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 font-mono"
                      />
                      <span className="text-xs text-slate-400">px</span>
                    </div>
                  </div>

                  {/* Contact & Address Font Size */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact & Address (px)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="13"
                        max="24"
                        value={formData.contactFontSize || 17}
                        onChange={(e) => handleNumberChange('contactFontSize', parseInt(e.target.value, 10))}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 font-mono"
                      />
                      <span className="text-xs text-slate-400">px</span>
                    </div>
                  </div>

                  {/* Field Values Font Size */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Customer & Field Values (px)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="14"
                        max="26"
                        value={formData.fieldValuesFontSize || 18}
                        onChange={(e) => handleNumberChange('fieldValuesFontSize', parseInt(e.target.value, 10))}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 font-mono"
                      />
                      <span className="text-xs text-slate-400">px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="py-2.5 px-3 text-xs text-red-600 hover:bg-red-50 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 text-xs font-semibold bg-brand-800 hover:bg-brand-850 active:bg-brand-900 text-white rounded-xl shadow-btn flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
