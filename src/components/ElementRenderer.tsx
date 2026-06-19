/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Heart,
  Star,
  Zap,
  Cpu,
  Sliders,
  Shield,
  Smartphone,
  Laptop,
  Settings as SettingsIcon,
  Tv,
  Award,
  Gift,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize,
  Play,
} from 'lucide-react';
import { UXElement, ViewMode } from '../types';

interface ElementRendererProps {
  key?: React.Key;
  element: UXElement;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  viewMode: ViewMode;
  onInteractiveClick?: (id: string, e: React.MouseEvent) => void;
  activePreviewMode: boolean;
  onDoubleClickText?: (id: string, text: string) => void;
  onAddChildElement?: (parentId: string, type: any) => void;
}

// Icon mapper for lucide
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Heart,
  Star,
  Zap,
  Cpu,
  Sliders,
  Shield,
  Smartphone,
  Laptop,
  Settings: SettingsIcon,
  Tv,
  Award,
  Gift,
};

const COL_SPANS: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
};

const TABLET_SPANS: Record<number, string> = {
  1: 'col-span-6',
  2: 'col-span-6',
  3: 'col-span-6',
  4: 'col-span-6',
  5: 'col-span-6',
  6: 'col-span-6',
  7: 'col-span-12',
  8: 'col-span-12',
  9: 'col-span-12',
  10: 'col-span-12',
  11: 'col-span-12',
  12: 'col-span-12',
};

const GALLERY_COLS: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  6: 'md:grid-cols-6',
};

export default function ElementRenderer({
  element,
  selectedId,
  setSelectedId,
  hoveredId,
  setHoveredId,
  viewMode,
  onInteractiveClick,
  activePreviewMode,
  onDoubleClickText,
  onAddChildElement,
}: ElementRendererProps) {
  const { id, type, props, children } = element;
  const isSelected = selectedId === id;
  const isHovered = hoveredId === id;

  // Active slide index for the Slider component specifically
  const [activeSlide, setActiveSlide] = useState(0);

  // Text inline editing triggers
  const [isEditingText, setIsEditingText] = useState(false);
  const [localText, setLocalText] = useState(props.text || '');

  // Pre-calculate Column Grid sizing to pass to Outer Wrappers
  let colSpanString = '';
  if (type === 'column') {
    const span = props.span || 12;
    colSpanString = COL_SPANS[span] || 'col-span-12';
    if (viewMode === 'mobile') {
      colSpanString = 'col-span-12';
    } else if (viewMode === 'tablet') {
      colSpanString = TABLET_SPANS[span] || 'col-span-12';
    }
  }

  // Row gutters map to spacing margins
  const gutterSpacings: Record<string, string> = {
    none: 'gap-0',
    small: 'gap-3 md:gap-4',
    medium: 'gap-5 md:gap-6',
    large: 'gap-8 md:gap-10',
  };

  // Border styles map to CSS
  const dividerStyles: Record<string, string> = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    double: 'border-double',
  };

  // Alignments helper options
  const getAlignClass = (align: string) => {
    if (align?.includes('left')) return 'text-left justify-start items-start';
    if (align?.includes('right')) return 'text-right justify-end items-end';
    return 'text-center justify-center items-center';
  };

  // Handles text edit actions
  const handleTextBlur = () => {
    setIsEditingText(false);
    if (onDoubleClickText) {
      onDoubleClickText(id, localText);
    }
  };

  const handleTextDoubleClick = (e: React.MouseEvent) => {
    if (activePreviewMode) return;
    e.stopPropagation();
    setLocalText(props.text || '');
    setIsEditingText(true);
  };

  // Custom visual overlay styles for Sections
  const overlayStyle = props.overlay
    ? { backgroundColor: props.overlay }
    : undefined;

  // Build element markup inside canvas Frame viewport
  const renderInnerContent = () => {
    switch (type) {
      case 'section': {
        const bgStyle = {
          backgroundColor: props.bg_color || 'transparent',
          backgroundImage: props.bg_image ? `url(${props.bg_image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          paddingTop: props.padding_top || '60px',
          paddingBottom: props.padding_bottom || '60px',
        };

        return (
          <div
            id={`section-${id}`}
            style={bgStyle}
            className={`relative w-full transition-all duration-300 ${props.class || ''}`}
          >
            {/* Real overlay overlay layer */}
            {props.overlay && (
              <div
                className="absolute inset-0 z-0 pointer-events-none transition-all"
                style={overlayStyle}
              ></div>
            )}

            {/* Grid Container wrapper */}
            <div className="relative z-10 w-full px-4 md:px-8 mx-auto">
              {children && children.length > 0 ? (
                <div className="space-y-4">
                  {children.map((child) => (
                    <ElementRenderer
                      key={child.id}
                      element={child}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                      hoveredId={hoveredId}
                      setHoveredId={setHoveredId}
                      viewMode={viewMode}
                      onInteractiveClick={onInteractiveClick}
                      activePreviewMode={activePreviewMode}
                      onDoubleClickText={onDoubleClickText}
                      onAddChildElement={onAddChildElement}
                    />
                  ))}
                </div>
              ) : (
                /* Empty drop zone container helper */
                <div className="border border-dashed border-slate-400 py-10 w-full text-center text-slate-400 text-xs rounded-xl bg-slate-500/5 my-2">
                  <span>Section rỗng. Thêm Row hoặc elements vào đây.</span>
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'row': {
        const rowWidthClass = props.width === 'full-width' ? 'max-w-full' : 'max-w-7xl mx-auto';
        const gutterClass = gutterSpacings[props.gutter || 'medium'];

        return (
          <div
            id={`row-${id}`}
            className={`grid grid-cols-12 w-full ${gutterClass} ${rowWidthClass} transition-all relative ${props.class || ''}`}
          >
            {children && children.length > 0 ? (
              children.map((child) => (
                <ElementRenderer
                  key={child.id}
                  element={child}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  viewMode={viewMode}
                  onInteractiveClick={onInteractiveClick}
                  activePreviewMode={activePreviewMode}
                  onDoubleClickText={onDoubleClickText}
                  onAddChildElement={onAddChildElement}
                />
              ))
            ) : (
              <div className="col-span-12 border border-dashed border-indigo-300/60 py-6 text-center text-slate-400 text-xs rounded bg-indigo-50/5 flex flex-col items-center justify-center space-y-2">
                <span>Row trống. Thêm Column (Cột) vào đây.</span>
                {!activePreviewMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddChildElement && onAddChildElement(id, 'column');
                    }}
                    className="px-3 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 text-blue-600 rounded text-[11px] font-bold transition-all shadow-sm flex items-center cursor-pointer"
                  >
                    + Thêm Column mới
                  </button>
                )}
              </div>
            )}

            {/* Quick add column icon trigger on the right side if hovered/selected and has columns already */}
            {children && children.length > 0 && !activePreviewMode && (isSelected || isHovered) && (
              <div className="absolute top-1 right-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddChildElement && onAddChildElement(id, 'column');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded text-[9px] shadow transition-all hover:scale-105 active:scale-95 flex items-center space-x-1 cursor-pointer"
                  title="Thêm cột mới vào Row này"
                >
                  <span>+ Thêm Cột</span>
                </button>
              </div>
            )}
          </div>
        );
      }

      case 'column': {
        const colStyle = {
          backgroundColor: props.bg_color || 'transparent',
          padding: props.padding || '15px',
        };

        const flexAlignmentClass = getAlignClass(props.align || props.text_align || 'left');

        return (
          <div
            id={`column-${id}`}
            style={colStyle}
            className={`w-full flex flex-col justify-center rounded-lg transition-all ${flexAlignmentClass} ${props.class || ''}`}
          >
            {children && children.length > 0 ? (
              <div className="space-y-4 w-full">
                {children.map((child) => (
                  <ElementRenderer
                    key={child.id}
                    element={child}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    viewMode={viewMode}
                    onInteractiveClick={onInteractiveClick}
                    activePreviewMode={activePreviewMode}
                    onDoubleClickText={onDoubleClickText}
                    onAddChildElement={onAddChildElement}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full border border-dashed border-sky-300 border-opacity-40 py-8 text-center text-slate-400 text-xs rounded-lg min-h-[80px] flex items-center justify-center bg-sky-500/5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">+ Add Node</span>
              </div>
            )}
          </div>
        );
      }

      case 'text': {
        return (
          <div
            id={`text-${id}`}
            onDoubleClick={handleTextDoubleClick}
            className={`w-full relative group transition-all text-slate-800 ${props.class || ''}`}
          >
            {isEditingText ? (
              <textarea
                value={localText}
                onChange={(e) => setLocalText(e.target.value)}
                onBlur={handleTextBlur}
                autoFocus
                rows={4}
                className="w-full bg-white text-slate-900 font-mono text-xs border-2 border-blue-500 p-2 rounded shadow-inner outline-none z-40"
              />
            ) : (
              <div
                className="prose max-w-none text-inherit leading-relaxed focus:outline-none"
                dangerouslySetInnerHTML={{ __html: props.text || 'Nhấp đúp chuột để soạn thảo văn bản...' }}
              />
            )}
            {!activePreviewMode && !isEditingText && (
              <div className="absolute right-1 bottom-1 opacity-0 group-hover:opacity-100 bg-[#161d2d] text-slate-350 text-[9px] px-1.5 py-0.5 rounded pointer-events-none transition-opacity">
                Double click to Edit
              </div>
            )}
          </div>
        );
      }

      case 'image': {
        const imgStyle = {
          width: props.width || '100%',
          height: props.height || 'auto',
          borderRadius: props.radius || '0px',
        };

        const zoomClass = props.hover_effect === 'zoom' ? 'hover:scale-[1.04] transition-transform duration-300' : '';
        const fadeClass = props.hover_effect === 'fade' ? 'hover:opacity-80 transition-opacity' : '';
        const glowClass = props.hover_effect === 'glow' ? 'hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] hover:border-blue-400 transition-all duration-300' : '';

        return (
          <div
            id={`image-${id}`}
            className={`flex flex-col ${getAlignClass(props.align || 'center')} ${props.class || ''}`}
          >
            <div className="overflow-hidden rounded-lg inline-block">
              <img
                src={props.url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}
                alt={element.label}
                style={imgStyle}
                referrerPolicy="no-referrer"
                className={`object-cover block border border-transparent ${zoomClass} ${fadeClass} ${glowClass}`}
              />
            </div>
          </div>
        );
      }

      case 'button': {
        const sizeClasses: Record<string, string> = {
          small: 'px-3 py-1.5 text-xs',
          medium: 'px-5 py-2.5 text-sm',
          large: 'px-7 py-3 text-base font-bold tracking-wide',
        };

        const colorClasses: Record<string, string> = {
          primary: 'bg-blue-600 border-blue-600 hover:bg-blue-500 text-white hover:text-white',
          secondary: 'bg-slate-700 border-slate-700 hover:bg-slate-600 text-white',
          success: 'bg-emerald-600 border-emerald-600 hover:bg-emerald-500 text-white',
          alert: 'bg-rose-600 border-rose-600 hover:bg-rose-500 text-white',
          white: 'bg-transparent border-white hover:bg-white hover:text-slate-900 text-white',
        };

        const styleClasses: Record<string, string> = {
          filled: 'border-0 shadow-md',
          outline: 'bg-transparent border-2 border-current text-current hover:bg-current hover:bg-opacity-10 shadow-sm',
          round: 'border-0 rounded-full shadow-md',
          underline: 'bg-transparent border-t-0 border-r-0 border-l-0 border-b-2 border-blue-600 rounded-none shadow-none pb-1 hover:border-black text-slate-800 hover:bg-slate-50',
        };

        const alignmentClass = getAlignClass(props.align || 'center');

        return (
          <div
            id={`button-${id}`}
            className={`w-full flex ${alignmentClass} ${props.class || ''}`}
          >
            <a
              href={props.link || '#'}
              onClick={(e) => {
                if (!activePreviewMode) e.preventDefault();
              }}
              className={`inline-block font-sans font-semibold text-center rounded transition-all duration-200 cursor-pointer ${
                sizeClasses[props.size || 'medium']
              } ${
                colorClasses[props.color || 'primary']
              } ${
                styleClasses[props.style || 'filled']
              }`}
            >
              {props.text || 'Explore Works'}
            </a>
          </div>
        );
      }

      case 'slider': {
        const slideNodes = children || [];
        const hasSlides = slideNodes.length > 0;

        return (
          <div
            id={`slider-${id}`}
            className={`relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 ${props.class || ''}`}
            style={{ minHeight: props.height || '380px' }}
          >
            {hasSlides ? (
              <div className="relative w-full h-full">
                {/* Active Slider section */}
                <div className="w-full h-full transition-all duration-500 ease-in-out">
                  <ElementRenderer
                    element={slideNodes[activeSlide]}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    viewMode={viewMode}
                    onInteractiveClick={onInteractiveClick}
                    activePreviewMode={activePreviewMode}
                    onDoubleClickText={onDoubleClickText}
                    onAddChildElement={onAddChildElement}
                  />
                </div>

                {/* Left / Right slider arrows selectors */}
                {props.arrows !== false && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide((prev) => (prev === 0 ? slideNodes.length - 1 : prev - 1));
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-colors z-20 cursor-pointer"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide((prev) => (prev === slideNodes.length - 1 ? 0 : prev + 1));
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-colors z-20 cursor-pointer"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Swiper dots bullets bottom */}
                {props.bullets !== false && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                    {slideNodes.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSlide(idx);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          activeSlide === idx ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Live Floating labels indicator */}
                {!activePreviewMode && (
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow z-30 tracking-wide font-mono">
                    SLIDE {activeSlide + 1}/{slideNodes.length}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-900 text-slate-400">
                <Sliders size={32} className="text-slate-600 animate-pulse mb-2" />
                <span className="text-xs">Slider rỗng. Thêm các slides (Section) để hoạt động.</span>
              </div>
            )}
          </div>
        );
      }

      case 'gallery': {
        const imageList = props.images || [];
        const cols = props.columns || 3;
        const galleryColClass = GALLERY_COLS[cols] || 'md:grid-cols-3';

        return (
          <div
            id={`gallery-${id}`}
            className={`w-full transition-all ${props.class || ''}`}
          >
            {imageList.length > 0 ? (
              <div className={`grid grid-cols-2 ${galleryColClass} gap-4`}>
                {imageList.map((url: string, index: number) => (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
                  >
                    <img
                      src={url}
                      alt={`Gallery item ${index}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-44 object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <span className="bg-white/90 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded shadow flex items-center space-x-1">
                        <Maximize size={11} />
                        <span>ZOOM LIGHTBOX</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-teal-300 bg-teal-500/5 py-10 text-center text-slate-400 rounded-lg text-xs">
                <span>Gallery trống. Thêm ảnh từ thanh Inspector bên phải.</span>
              </div>
            )}
          </div>
        );
      }

      case 'video': {
        const aspectClass =
          props.aspect === '4:3'
            ? 'aspect-[4/3]'
            : props.aspect === '1:1'
            ? 'aspect-square'
            : props.aspect === '21:9'
            ? 'aspect-[21/9]'
            : 'aspect-video';

        return (
          <div
            id={`video-${id}`}
            className={`w-full relative shadow-lg rounded-xl overflow-hidden border border-slate-200 ${aspectClass} ${props.class || ''}`}
          >
            <iframe
              src={props.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
              title="UX Embedded Video Frame"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full object-cover rounded-xl"
            ></iframe>
          </div>
        );
      }

      case 'map': {
        const query = encodeURIComponent(props.address || 'Hanoi, Vietnam');
        const zoomVal = props.zoom || 14;
        const frameHeight = props.height || '350px';

        return (
          <div
            id={`map-${id}`}
            className={`w-full rounded-xl overflow-hidden border border-slate-200/80 shadow ${props.class || ''}`}
            style={{ height: frameHeight }}
          >
            {/* Free instant Google Map routing embed URL */}
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={`https://maps.google.com/maps?q=${query}&t=&z=${zoomVal}&ie=UTF8&iwloc=&output=embed`}
              className="rounded-xl border-0"
              title="UX Map Embed"
            ></iframe>
          </div>
        );
      }

      case 'gap': {
        return (
          <div
            id={`gap-${id}`}
            style={{ height: props.height || '40px' }}
            className={`w-full flex items-center justify-center bg-transparent border-y border-dashed border-slate-300 border-opacity-0 hover:border-opacity-35 transition-all duration-200 ${props.class || ''}`}
          >
            {!activePreviewMode && (
              <span className="text-[10px] text-slate-400 font-mono scale-90">
                GAP: {props.height || '30px'}
              </span>
            )}
          </div>
        );
      }

      case 'divider': {
        const thicknessPx = props.thickness || '3px';
        const dividerStyle: React.CSSProperties = {
          borderTopWidth: thicknessPx,
          borderTopColor: props.color || '#cbd5e1',
          width: props.width || '100px',
        };

        const dividerAlignClass = props.align === 'left' ? 'mx-0' : props.align === 'right' ? 'ml-auto mr-0' : 'mx-auto';

        return (
          <div
            id={`divider-${id}`}
            className={`w-full flex ${props.class || ''}`}
          >
            <hr
              style={dividerStyle}
              className={`border-t ${dividerStyles[props.style || 'solid']} ${dividerAlignClass} transition-all`}
            />
          </div>
        );
      }

      case 'icon': {
        const IconComponent = ICON_MAP[props.name] || Heart;

        const iconStyle: React.CSSProperties = {
          fontSize: props.size || '36px',
          color: props.color || '#3b82f6',
        };

        const wrapperStyle: React.CSSProperties = {
          backgroundColor: props.bg_type === 'circle' || props.bg_type === 'square' ? props.bg_color || 'rgba(59,130,246,0.15)' : 'transparent',
          borderRadius: props.bg_type === 'circle' ? '9999px' : props.bg_type === 'square' ? '8px' : '0px',
          padding: props.bg_type !== 'none' ? '12px' : '0px',
        };

        const alignmentClass = getAlignClass(props.align || 'center');

        return (
          <div
            id={`icon-${id}`}
            className={`w-full flex ${alignmentClass} ${props.class || ''}`}
          >
            <div
              style={wrapperStyle}
              className="inline-flex items-center justify-center transition-all hover:scale-105 border border-transparent"
            >
              <IconComponent style={iconStyle} size={parseInt(props.size) || 36} />
            </div>
          </div>
        );
      }

      default:
        return <div>Element {type} not found</div>;
    }
  };

  // Click-to-select hook inside canvas editor frame
  const handleElementTouchSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    if (onInteractiveClick) {
      onInteractiveClick(id, e);
    }
  };

  // Hover highlighting guidelines
  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePreviewMode) {
      setHoveredId(id);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePreviewMode) {
      setHoveredId(null);
    }
  };

  // Rendering wrappers for visual outlines & labeling in edit mode
  if (activePreviewMode) {
    return (
      <div 
        onClick={handleElementTouchSelect} 
        className={type === 'column' ? colSpanString : undefined}
      >
        {renderInnerContent()}
      </div>
    );
  }

  // Edit Mode wrapping: Beautiful blue boxes and labels!
  return (
    <div
      onClick={handleElementTouchSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${type === 'column' ? colSpanString : ''} relative transition-all ${
        isSelected
          ? 'outline-2 outline-blue-500 outline-solid ring-2 ring-blue-500/10 shadow-sm'
          : isHovered
          ? 'outline-1 outline-blue-400/70 outline-dashed'
          : 'outline-1 outline-transparent'
      }`}
      style={{
        cursor: 'pointer',
        minWidth: '20px',
      }}
    >
      {/* Visual floating tags */}
      {isHovered && !isSelected && (
        <span className="absolute left-0 top-0 -translate-y-4 bg-blue-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-t z-40 shadow pointer-events-none uppercase tracking-wider font-mono">
          {type}
        </span>
      )}

      {isSelected && (
        <span className="absolute left-0 top-0 -translate-y-4 bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-t z-40 shadow pointer-events-none uppercase tracking-widest font-mono flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse"></span>
          <span>{type} #{id}</span>
        </span>
      )}

      {/* Render core inner block */}
      {renderInnerContent()}
    </div>
  );
}
