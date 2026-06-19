/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  PlusCircle,
  Sparkles,
  ChevronRight,
  Blocks,
  RefreshCcw,
} from 'lucide-react';
import { UXElement, ViewMode, ElementType } from '../types';
import ElementRenderer from './ElementRenderer';

interface InsertionBarProps {
  index: number;
  onInsertElement: (type: ElementType, index: number) => void;
  activePreviewMode: boolean;
}

function InsertionBar({ index, onInsertElement, activePreviewMode }: InsertionBarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (activePreviewMode) return null;

  return (
    <div className="relative group/insert py-1 flex justify-center items-center h-10 transition-all select-none col-span-12 w-full">
      {/* Horizontal Line background */}
      <div className="absolute inset-x-0 h-[1.5px] bg-[#e2e8f0] group-hover/insert:bg-blue-400/80 transition-colors pointer-events-none"></div>

      {/* Trigger Button or selection grid */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="relative z-10 bg-white border border-slate-205 group-hover/insert:border-blue-500 group-hover/insert:bg-blue-500 group-hover/insert:text-white text-slate-600 h-6 px-3.5 rounded-full text-[10px] font-bold shadow-sm hover:shadow transition-all flex items-center space-x-1 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="text-sm font-semibold opacity-80 leading-none mb-0.5">+</span>
          <span>Chèn layout ở đây</span>
        </button>
      ) : (
        <div className="relative z-10 bg-white border border-blue-200 rounded-lg shadow-md p-2 flex items-center space-x-2 animate-fade-in divide-x divide-slate-100 border-dashed">
          <div className="flex items-center space-x-1.5 pr-2">
            <span className="text-[10px] uppercase font-mono font-extrabold text-blue-600 tracking-wide">
              Chèn:
            </span>
          </div>

          <div className="flex items-center space-x-1.5 pl-2 gap-1 bg-white">
            <button
              onClick={() => {
                onInsertElement('section', index);
                setIsOpen(false);
              }}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-250 text-emerald-700 hover:border-emerald-600 rounded text-[10px] font-bold transition-all shadow-sm flex items-center cursor-pointer"
            >
              + Section
            </button>
            <button
              onClick={() => {
                onInsertElement('row', index);
                setIsOpen(false);
              }}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-250 text-blue-700 hover:border-blue-600 rounded text-[10px] font-bold transition-all shadow-sm flex items-center cursor-pointer"
            >
              + Row
            </button>
            <button
              onClick={() => {
                onInsertElement('gap', index);
                setIsOpen(false);
              }}
              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-600 hover:text-white border border-slate-250 text-slate-700 hover:border-slate-600 rounded text-[10px] font-bold transition-all shadow-sm flex items-center cursor-pointer"
            >
              + Khoảng trống (Gap)
            </button>
            <button
              onClick={() => {
                onInsertElement('divider', index);
                setIsOpen(false);
              }}
              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-600 hover:text-white border border-purple-255 text-purple-700 hover:border-purple-600 rounded text-[10px] font-bold transition-all shadow-sm flex items-center cursor-pointer"
            >
              + Đường kẻ (Divider)
            </button>
          </div>

          <div className="pl-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-2 py-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded text-[10px] font-bold transition-all cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface CanvasProps {
  elements: UXElement[];
  viewMode: ViewMode;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  activePreviewMode: boolean;
  onUpdateProps: (id: string, newProps: Record<string, any>) => void;
  onAddElement: (type: any) => void;
  onInsertElement: (type: ElementType, index: number) => void;
  onAddChildElement?: (parentId: string, type: ElementType) => void;
  onLoadMock: () => void;
}

export default function Canvas({
  elements,
  viewMode,
  selectedId,
  setSelectedId,
  hoveredId,
  setHoveredId,
  activePreviewMode,
  onUpdateProps,
  onAddElement,
  onInsertElement,
  onAddChildElement,
  onLoadMock,
}: CanvasProps) {
  // Map viewport dimensions
  const getViewportWidthClass = () => {
    if (viewMode === 'mobile') return 'max-w-[375px] border-[10px] border-slate-900 rounded-[36px] shadow-2xl';
    if (viewMode === 'tablet') return 'max-w-[768px] border-[8px] border-slate-800 rounded-[20px] shadow-xl';
    return 'max-w-full';
  };

  const handleCanvasOutsideClick = (e: React.MouseEvent) => {
    // clicked outer background of frame -> deselect current active item
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  const hasElements = elements.length > 0;

  return (
    <div
      id="ux-builder-canvas-wrapper"
      onClick={handleCanvasOutsideClick}
      className="flex-1 bg-[#f1f3f5] overflow-y-auto p-6 flex justify-center items-start custom-scrollbar select-none"
    >
      <div
        id="ux-builder-viewport"
        className={`w-full bg-white transition-all duration-300 min-h-[82vh] relative ${getViewportWidthClass()} ${
          viewMode !== 'desktop' ? 'my-3 border-neutral-800' : ''
        }`}
      >
        {/* Device top Notch/speaker bar simulation for pristine mobile mockup */}
        {viewMode === 'mobile' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-b-xl z-50 flex items-center justify-center">
            <div className="w-10 h-1 bg-slate-800 rounded-full mb-1"></div>
          </div>
        )}

        {viewMode === 'tablet' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-850 rounded-full z-50 mt-1"></div>
        )}

        {/* Dynamic canvas element listings */}
        <div className={`w-full h-full ${viewMode === 'mobile' ? 'pt-6 pb-2.5 rounded-[26px]' : viewMode === 'tablet' ? 'pt-4 rounded-[12px]' : ''} overflow-x-hidden bg-white`}>
          {hasElements ? (
            <div className="w-full">
              <InsertionBar
                index={0}
                onInsertElement={onInsertElement}
                activePreviewMode={activePreviewMode}
              />
              {elements.map((el, idx) => (
                <React.Fragment key={el.id}>
                  <ElementRenderer
                    element={el}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    viewMode={viewMode}
                    activePreviewMode={activePreviewMode}
                    onDoubleClickText={(id, updatedText) => onUpdateProps(id, { text: updatedText })}
                    onAddChildElement={onAddChildElement}
                  />
                  <InsertionBar
                    index={idx + 1}
                    onInsertElement={onInsertElement}
                    activePreviewMode={activePreviewMode}
                  />
                </React.Fragment>
              ))}
            </div>
          ) : (
            /* Canvas Empty Welcome banner */
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center min-h-[70vh] max-w-lg mx-auto">
              <div className="p-5 bg-blue-50 text-blue-600 rounded-full shadow border border-blue-150 mb-6 scale-110">
                <Blocks size={40} className="stroke-[1.5]" />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-850">
                Giao Diện Thiết Kế Flatsome UX
              </h2>
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                Canvas của bạn hiện chưa có cấu trúc. Hãy thêm các element Layout hoặc nội dung từ thanh công cụ bên trái để bắt đầu thiết lập trang web bán hàng WooCommerce.
              </p>

              {/* Presets setup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-8">
                <button
                  onClick={onLoadMock}
                  className="p-3 border border-blue-500/30 bg-blue-500/5 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold text-blue-600 transition-all flex items-center justify-center space-x-2"
                >
                  <RefreshCcw size={13} />
                  <span>Tải Mẫu Landing Page</span>
                </button>

                <button
                  onClick={() => onAddElement('section')}
                  className="p-3 border border-slate-350 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center justify-center space-x-2"
                >
                  <PlusCircle size={13} />
                  <span>Thêm Section Mới</span>
                </button>
              </div>

              {/* Design tips list */}
              <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl mt-8 w-full text-left">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 block">💡 THIẾT KẾ ĐẠT CHUẨN FLATSOME:</span>
                <ul className="text-[11px] text-slate-500 mt-2 space-y-1.5 list-disc list-inside">
                  <li>Nên đặt <strong className="text-slate-700">Section</strong> trước để quản lý background phủ và khoảng đệm (padding).</li>
                  <li>Sử dụng <strong className="text-slate-700">Row</strong> và chia các cột <strong className="text-slate-700">Column (1-12)</strong> tương tự Bootstrap grid.</li>
                  <li>Sắp xếp Navigator cây thư mục để dễ chọn phần tử con bị chìm đè.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
