import React from 'react';
import {
  Settings,
  Trash2,
  Copy,
  ChevronDown,
  Sparkles,
  Link,
  Type,
  Image as ImageIcon,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { UXElement, ElementType } from '../types';

interface RightSidebarProps {
  selectedElement: UXElement | null;
  onUpdateProps: (id: string, newProps: Record<string, any>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onAddChildElement?: (parentId: string, type: ElementType) => void;
}

export default function RightSidebar({
  selectedElement,
  onUpdateProps,
  onDeleteElement,
  onDuplicateElement,
  onAddChildElement,
}: RightSidebarProps) {
  // If no element is selected, give a beautiful mock welcome state
  if (!selectedElement) {
    return (
      <div id="ux-builder-right-sidebar" className="w-[300px] bg-white border-l border-gray-300 flex flex-col items-center justify-center text-center p-6 h-full text-gray-400 select-none font-sans shrink-0">
        <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-full text-gray-400 mb-4 shadow-sm animate-pulse">
          <Settings size={28} />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">Không có element</h3>
        <p className="text-[11px] text-gray-500 mt-2 leading-relaxed max-w-[200px]">
          Hãy chọn một thành phần bất kỳ trên Canvas hoặc cây Navigator để bắt đầu tinh chỉnh tham số.
        </p>
      </div>
    );
  }

  const { id, type, label, props } = selectedElement;

  const handleChange = (key: string, value: any) => {
    onUpdateProps(id, { [key]: value });
  };

  const colors = [
    { name: 'Trong suốt', value: 'rgba(0,0,0,0)' },
    { name: 'Tối mờ (Slate)', value: '#0f172a' },
    { name: 'Xanh Slate', value: '#1e293b' },
    { name: 'Teal Độc Quyên', value: '#0d9488' },
    { name: 'Xanh Lam', value: '#2b82f6' },
    { name: 'Đỏ Ruby', value: '#ef4444' },
    { name: 'Vàng Amber', value: '#f59e0b' },
    { name: 'Trắng tinh', value: '#ffffff' },
    { name: 'Màu sữa nhạt', value: '#f8fafc' },
  ];

  return (
    <div id="ux-builder-right-sidebar" className="w-[300px] bg-white border-l border-gray-300 flex flex-col h-full overflow-hidden text-gray-800 select-none shrink-0 font-sans">
      {/* Settings Header */}
      <div className="px-3.5 py-2.5 bg-gray-50 border-b border-gray-300 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <span className="p-0.5 px-1.5 bg-blue-50 border border-blue-100 rounded text-[9px] text-blue-650 uppercase font-mono font-bold">
            {type}
          </span>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-800">Chỉnh Sửa</h3>
        </div>

        {/* Toolbar actions inside Right Panel */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onDuplicateElement(id)}
            className="p-1.5 bg-white border border-gray-200 text-gray-500 hover:text-gray-800 rounded hover:bg-gray-100/50 transition-colors"
            title="Nhân bản element"
          >
            <Copy size={11} />
          </button>
          <button
            onClick={() => onDeleteElement(id)}
            className="p-1.5 bg-white border border-gray-200 text-gray-550 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
            title="Xóa element"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Inspector Form Scroll */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar text-[11px] bg-white">
        {/* Basic Meta Label */}
        <div className="bg-gray-50/50 p-2.5 rounded border border-gray-200 space-y-1.5">
          <label className="text-[9px] uppercase font-mono font-bold text-gray-450 block">Tên element hiển thị</label>
          <input
            type="text"
            value={label || ''}
            onChange={(e) => onUpdateProps(id, { label: e.target.value })}
            className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>

        {/* Category: Render custom options based on type */}

        {/* SECTION BLOCK */}
        {type === 'section' && (
          <div className="space-y-3.5">
            <h4 className="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">
              SECTION SETTINGS
            </h4>

            {/* Custom padding top */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-gray-600">
                <label>Padding Trên ({props.padding_top || '0px'})</label>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="10"
                value={parseInt(props.padding_top) || 0}
                onChange={(e) => handleChange('padding_top', `${e.target.value}px`)}
                className="w-full accent-blue-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Custom padding bottom */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-gray-600">
                <label>Padding Dưới ({props.padding_bottom || '0px'})</label>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="10"
                value={parseInt(props.padding_bottom) || 0}
                onChange={(e) => handleChange('padding_bottom', `${e.target.value}px`)}
                className="w-full accent-blue-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Background colors */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Màu Nền Section</label>
              <div className="grid grid-cols-5 gap-1">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => handleChange('bg_color', c.value)}
                    className={`h-5 rounded border ${
                      props.bg_color === c.value ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-205 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: c.value === 'rgba(0,0,0,0)' ? 'transparent' : c.value }}
                    title={c.name}
                  >
                    {c.value === 'rgba(0,0,0,0)' && <span className="text-[9px] text-gray-400">🚫</span>}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={props.bg_color || ''}
                placeholder="#HEX hoặc RGBA..."
                onChange={(e) => handleChange('bg_color', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none text-left"
              />
            </div>

            {/* Background images url */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">URL Hình Nền (Background URL)</label>
              <input
                type="text"
                value={props.bg_image || ''}
                placeholder="https://images.unsplash.com/..."
                onChange={(e) => handleChange('bg_image', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none font-mono"
              />
            </div>

            {/* Overlay Cover */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Lớp Phủ Màu Overlay</label>
              <input
                type="text"
                value={props.overlay || ''}
                placeholder="rgba(0,0,0,0.4)"
                onChange={(e) => handleChange('overlay', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ROW BLOCK */}
        {type === 'row' && (
          <div className="space-y-3.5">
            <h4 className="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">
              ROW SETTINGS
            </h4>

            {/* Gutter spacings */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Khoảng cách cột (Gutter)</label>
              <select
                value={props.gutter || 'medium'}
                onChange={(e) => handleChange('gutter', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              >
                <option value="none">Sát nhau (None)</option>
                <option value="small">Nhỏ (Small)</option>
                <option value="medium">Vừa (Medium)</option>
                <option value="large">Rộng (Large)</option>
              </select>
            </div>

            {/* Content widths restriction */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Chiều rộng Row</label>
              <select
                value={props.width || 'container'}
                onChange={(e) => handleChange('width', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              >
                <option value="container">Khung giới hạn (Container)</option>
                <option value="full-width">Toàn màn hình (Full width)</option>
              </select>
            </div>

            {/* Quick action to append a column inside this row */}
            <div className="pt-3 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={() => onAddChildElement && onAddChildElement(id, 'column')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg shadow-sm text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer uppercase tracking-wider border border-blue-500 hover:shadow"
              >
                <span>+ Thêm cột mới (Column)</span>
              </button>
              <p className="text-[10px] text-gray-400 mt-1.5 text-center leading-normal">
                Sử dụng nút này để thêm một column mới trực tiếp vào hàng này tương tự như Flatsome.
              </p>
            </div>
          </div>
        )}

        {/* COLUMN BLOCK */}
        {type === 'column' && (
          <div className="space-y-3.5">
            <h4 className="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">
              COLUMN SETTINGS
            </h4>

            {/* Span width select (1 to 12 structure) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <label>Độ rộng Grid (Span: {props.span || 12}/12)</label>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={props.span || 12}
                onChange={(e) => handleChange('span', parseInt(e.target.value))}
                className="w-full accent-blue-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                <span>1 col</span>
                <span>4 (1/3)</span>
                <span>6 (1/2)</span>
                <span>12 (Full)</span>
              </div>
            </div>

            {/* Background col color */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Màu nền cột</label>
              <input
                type="text"
                value={props.bg_color || ''}
                placeholder="#f8fafc hoặc transparent..."
                onChange={(e) => handleChange('bg_color', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              />
            </div>

            {/* Column specific inner padding */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Padding nội dung</label>
              <input
                type="text"
                value={props.padding || ''}
                placeholder="20px..."
                onChange={(e) => handleChange('padding', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              />
            </div>

            {/* Text alignment in col wrapper */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Căn lề chữ (Text Align)</label>
              <div className="flex bg-gray-50 rounded p-0.5 border border-gray-200">
                <button
                  type="button"
                  onClick={() => handleChange('align', 'left')}
                  className={`flex-1 py-1 rounded flex justify-center text-gray-650 ${
                    props.align === 'left' || !props.align ? 'bg-white shadow-sm font-bold text-blue-600 border border-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignLeft size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('align', 'center')}
                  className={`flex-1 py-1 rounded flex justify-center text-gray-650 ${
                    props.align === 'center' ? 'bg-white shadow-sm font-bold text-blue-600 border border-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignCenter size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('align', 'right')}
                  className={`flex-1 py-1 rounded flex justify-center text-gray-650 ${
                    props.align === 'right' ? 'bg-white shadow-sm font-bold text-blue-600 border border-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignRight size={12} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TEXT BLOCK */}
        {type === 'text' && (
          <div className="space-y-3.5">
            <h4 className="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">
              TEXT BLOCK OPTIONS
            </h4>

            {/* Main content typing box */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block font-semibold">Nội dung Văn Bản (HTML/Shortcode)</label>
              <textarea
                value={props.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                rows={6}
                className="w-full bg-white border border-gray-250 rounded p-2 text-gray-800 text-[11px] font-sans focus:outline-none focus:border-blue-500 font-mono"
                placeholder="Nhập nội dung văn bản..."
              />
            </div>

            {/* Text alignment in col wrapper */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Căn lề chữ (Text Align)</label>
              <div className="flex bg-gray-50 rounded p-0.5 border border-gray-200">
                <button
                  type="button"
                  onClick={() => handleChange('align', 'left')}
                  className={`flex-1 py-1 rounded flex justify-center text-gray-650 ${
                    props.align === 'left' || !props.align ? 'bg-white shadow-sm font-bold text-blue-600 border border-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignLeft size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('align', 'center')}
                  className={`flex-1 py-1 rounded flex justify-center text-gray-650 ${
                    props.align === 'center' ? 'bg-white shadow-sm font-bold text-blue-600 border border-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignCenter size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('align', 'right')}
                  className={`flex-1 py-1 rounded flex justify-center text-gray-650 ${
                    props.align === 'right' ? 'bg-white shadow-sm font-bold text-blue-600 border border-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignRight size={11} />
                </button>
              </div>
            </div>

            {/* Extra padding and margins formatting */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Cỡ chữ (font-size)</label>
              <input
                type="text"
                value={props.font_size || '14px'}
                onChange={(e) => handleChange('font_size', e.target.value)}
                placeholder="15px, 1.2rem..."
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-600 block">Màu sắc văn bản (hex)</label>
              <input
                type="text"
                value={props.text_color || '#333333'}
                onChange={(e) => handleChange('text_color', e.target.value)}
                placeholder="#333333"
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* IMAGE BLOCK */}
        {type === 'image' && (
          <div className="space-y-3.5">
            <h4 className="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">
              IMAGE OPTIONS
            </h4>

            {/* URL Image Source */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Đường dẫn file Hình Ảnh (URL Src)</label>
              <textarea
                value={props.image_url || ''}
                onChange={(e) => handleChange('image_url', e.target.value)}
                rows={3}
                placeholder="https://..."
                className="w-full bg-white border border-gray-250 rounded p-1.5 text-gray-800 text-[11px] font-mono focus:outline-none"
              />
            </div>

            {/* Aspect Radio proportions */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Tỷ lệ khung hình (Aspect scale)</label>
              <select
                value={props.aspect_ratio || 'original'}
                onChange={(e) => handleChange('aspect_ratio', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px]"
              >
                <option value="original">Y bản gốc (Original auto)</option>
                <option value="16-9">Khung ngang tivi (16:9 widescreen)</option>
                <option value="4-3">Khung rạp xưa (4:3 Classic)</option>
                <option value="1-1">Hình vuông instagram (1:1 Square)</option>
                <option value="2-1">Khung dẹp dài (2:1 cinematic)</option>
              </select>
            </div>

            {/* Border Radius styling */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Bo tròn góc ảnh (Border Radius)</label>
              <select
                value={props.radius || 'none'}
                onChange={(e) => handleChange('radius', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px]"
              >
                <option value="none">Góc vuông sắc sảo (None)</option>
                <option value="small">Mỏng nhẹ (Rounded SM 4px)</option>
                <option value="medium">Vừa phải (Rounded MD 8px)</option>
                <option value="large">Cực bo cong (Rounded LG 16px)</option>
                <option value="full">Tròn trịa hoàn toàn (Circle 9999px)</option>
              </select>
            </div>
          </div>
        )}

        {/* BUTTON BLOCK */}
        {type === 'button' && (
          <div className="space-y-3.5">
            <h4 className="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">
              BUTTON CONFIGS
            </h4>

            {/* Content Labels */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Nội dung Chữ trên nút</label>
              <input
                type="text"
                value={props.text || 'XEM NGAY'}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              />
            </div>

            {/* Rel url redirects */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Đường dẫn liên kết (Link URL)</label>
              <input
                type="text"
                value={props.link || '#'}
                onChange={(e) => handleChange('link', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              />
            </div>

            {/* Presets and designs */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Kiểu dáng Button</label>
              <select
                value={props.style || 'solid'}
                onChange={(e) => handleChange('style', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px]"
              >
                <option value="solid">Đổ đậm khối màu (Solid background)</option>
                <option value="outline">Đường viền trống (Outline border)</option>
                <option value="flat">Không viền, lướt qua (Flat minimalist)</option>
              </select>
            </div>

            {/* Colors classes presets */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Tông màu nhận diện (Theme color)</label>
              <select
                value={props.color || 'primary'}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px]"
              >
                <option value="primary">Màu chính hệ thống (Default blue)</option>
                <option value="accent">Cam rực rỡ Flatsome (Accent Orange)</option>
                <option value="success">Thành công (Green emerald)</option>
                <option value="warning">Cảnh báo (Yellow amber)</option>
                <option value="danger">Khấn cấp nguy hiểm (Red ruby)</option>
                <option value="light">Màu Trắng sữa (Light Gray)</option>
                <option value="dark">Màu đen mun quý phái (Solid Dark)</option>
              </select>
            </div>
          </div>
        )}

        {/* SLIDER BLOCK */}
        {type === 'slider' && (
          <div className="space-y-3.5">
            <h4 className="font-bold text-[9px] tracking-widest text-[#2b82f6] uppercase border-b border-gray-200 pb-1 font-mono">
              SLIDER CAROUSEL SETTINGS
            </h4>

            {/* Autoplay continuous auto slide */}
            <div className="flex items-center space-x-2 py-1">
              <input
                type="checkbox"
                id="prop-slider-autoplay"
                checked={props.autoplay !== false}
                onChange={(e) => handleChange('autoplay', e.target.checked)}
                className="rounded text-blue-650 accent-blue-650 h-3.5 w-3.5"
              />
              <label htmlFor="prop-slider-autoplay" className="text-gray-750 font-medium cursor-pointer">
                Tự động chạy Slide (Autoplay loops)
              </label>
            </div>

            {/* Delay millisecond numbers times */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Thời gian đổi Slide (ms)</label>
              <input
                type="number"
                value={props.delay || 4000}
                onChange={(e) => handleChange('delay', parseInt(e.target.value) || 4000)}
                placeholder="4000"
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              />
            </div>

            {/* Heights parameter */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Chiều cao Slider (Height)</label>
              <input
                type="text"
                value={props.height || '400px'}
                onChange={(e) => handleChange('height', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* GALLERIES SELECTION PRESET */}
        {type === 'gallery' && (
          <div className="space-y-3.5">
            <h4 className="font-bold text-[9px] tracking-widest text-[#2b82f6] uppercase border-b border-gray-200 pb-1 font-mono">
              COLLAGE GALLERY SETTINGS
            </h4>

            {/* Grid display column size */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Số cột hiển thị (Columns grid count)</label>
              <select
                value={props.columns || 4}
                onChange={(e) => handleChange('columns', parseInt(e.target.value))}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px]"
              >
                <option value={2}>2 Cột gợn sóng</option>
                <option value={3}>3 Cột cân đối</option>
                <option value={4}>4 Cột súc tích phong phú</option>
                <option value={6}>6 Cột lưới xếp dày đặc</option>
              </select>
            </div>
          </div>
        )}

        {/* INTERACTIVE SEPARATOR DIVIDER */}
        {type === 'divider' && (
          <div className="space-y-3.5">
            <h4 className="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">
              DIVIDER SETTINGS
            </h4>

            {/* Pixel width horizontal sizes */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Độ rộng của đường (Width)</label>
              <input
                type="text"
                value={props.width || '50px'}
                onChange={(e) => handleChange('width', e.target.value)}
                placeholder="Ví dụ: 30px, 100%, 80px..."
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              />
            </div>

            {/* Thickness sizes */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Độ dày nét kẻ (Height thickness)</label>
              <input
                type="text"
                value={props.thickness || '3px'}
                onChange={(e) => handleChange('thickness', e.target.value)}
                placeholder="3px, 1px..."
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px]"
              />
            </div>
          </div>
        )}

        {/* VECTOR ICON SYMBOL */}
        {type === 'icon' && (
          <div className="space-y-3.5">
            <h4 className="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">
              ICON SYMBOL OPTIONS
            </h4>

            {/* Lucide icon name matching */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Tên vector biểu tượng (Lucide core)</label>
              <input
                type="text"
                value={props.name || 'Heart'}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              />
            </div>

            {/* Sizes parameters */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Kích thước biểu tượng (px)</label>
              <input
                type="text"
                value={props.size || '32px'}
                onChange={(e) => handleChange('size', e.target.value)}
                placeholder="Ví dụ: 30px, 48px..."
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              />
            </div>

            {/* Icon Color parameters */}
            <div className="space-y-1.5">
              <label className="text-gray-600 block">Màu sắc Icon Fill</label>
              <input
                type="text"
                value={props.color || '#3b82f6'}
                onChange={(e) => handleChange('color', e.target.value)}
                placeholder="#3b82f6"
                className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Global CSS class injector for developers hook */}
        <div className="pt-3 border-t border-gray-200 space-y-2">
          <h4 className="font-bold text-[8px] tracking-widest text-gray-400 uppercase font-mono">
            ADVANCED OPTION
          </h4>

          {/* CSS Class */}
          <div className="space-y-1">
            <label className="text-gray-500 block text-[10px]">Custom CSS Classes</label>
            <input
              type="text"
              value={props.class || ''}
              onChange={(e) => handleChange('class', e.target.value)}
              placeholder="e.g. animate-pulse drop-shadow"
              className="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Save action feedback banner bottom */}
      <div className="p-3 bg-gray-50 border-t border-gray-300 flex items-center justify-between px-3.5 text-[10px] text-gray-500 font-sans shrink-0">
        <span className="flex items-center space-x-1">
          <CheckCircle size={11} className="text-emerald-600" />
          <span>Đã đồng bộ realtime</span>
        </span>
        <button
          onClick={() => onUpdateProps(selectedElement.id, {})}
          className="bg-blue-600 hover:bg-blue-700 py-1 px-3.5 text-white rounded font-bold text-[9px] uppercase tracking-wider transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
}
