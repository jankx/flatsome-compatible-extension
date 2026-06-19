/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Plus,
  Compass,
  Layout,
  Type,
  Image as ImageIcon,
  MousePointerClick,
  SlidersHorizontal,
  FolderOpen,
  Tv,
  MapPin,
  Maximize2,
  Minus,
  Star,
  Trash2,
  Copy,
  FolderTree,
  ChevronRight,
  ChevronDown,
  Eye,
  Lock,
  Search,
} from 'lucide-react';
import { ElementType, UXElement } from '../types';

interface LeftSidebarProps {
  onAddElement: (type: ElementType) => void;
  elements: UXElement[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}

// Map element types to icons & colors for Flatsome aesthetic matching
const ELEMENT_META: Record<ElementType, { title: string; category: string; description: string; icon: React.ReactNode; color: string }> = {
  section: {
    title: 'Section',
    category: 'Layout',
    description: 'Bọc ngoài với background và padding tùy chỉnh',
    icon: <Layers size={16} />,
    color: 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20',
  },
  row: {
    title: 'Row',
    category: 'Layout',
    description: 'Hàng lưới phân bổ các cột cột bên trong',
    icon: <Layout size={16} />,
    color: 'bg-blue-500/10 text-blue-450 border-blue-500/20',
  },
  column: {
    title: 'Column',
    category: 'Layout',
    description: 'Cột hiển thị chứa các nội dung cụ thể',
    icon: <Compass size={16} />,
    color: 'bg-indigo-500/10 text-indigo-450 border-indigo-500/20',
  },
  text: {
    title: 'Text HTML',
    category: 'Content',
    description: 'Soạn thảo văn bản, tiêu đề, HTML tự do',
    icon: <Type size={16} />,
    color: 'bg-amber-500/10 text-amber-450 border-amber-500/20',
  },
  image: {
    title: 'Image',
    category: 'Content',
    description: 'Hình ảnh đơn với hiệu ứng hover mượt mà',
    icon: <ImageIcon size={16} />,
    color: 'bg-purple-500/10 text-purple-450 border-purple-500/20',
  },
  button: {
    title: 'Button',
    category: 'Basic',
    description: 'Nút bấm dẫn liên kết tùy chỉnh giao diện',
    icon: <MousePointerClick size={16} />,
    color: 'bg-rose-500/10 text-rose-450 border-rose-500/20',
  },
  slider: {
    title: 'Slider',
    category: 'Content',
    description: 'Trình chiếu slide banner đầy tính tương tác',
    icon: <SlidersHorizontal size={16} />,
    color: 'bg-cyan-500/10 text-cyan-450 border-cyan-500/20',
  },
  gallery: {
    title: 'Gallery Grid',
    category: 'Content',
    description: 'Bộ sưu tập lưới ảnh thu nhỏ lightbox',
    icon: <FolderOpen size={16} />,
    color: 'bg-teal-500/10 text-teal-450 border-teal-500/20',
  },
  video: {
    title: 'Video Embed',
    category: 'Content',
    description: 'Tải và phát video YouTube hoặc Vimeo',
    icon: <Tv size={16} />,
    color: 'bg-red-500/10 text-red-450 border-red-500/20',
  },
  map: {
    title: 'Map',
    category: 'Content',
    description: 'Bản đồ vị trí định vị doanh nghiệp',
    icon: <MapPin size={16} />,
    color: 'bg-lime-500/10 text-lime-450 border-lime-500/20',
  },
  gap: {
    title: 'Gap',
    category: 'Basic',
    description: 'Khoảng cách trống căn chỉnh chiều dọc',
    icon: <Maximize2 size={16} />,
    color: 'bg-gray-500/10 text-gray-450 border-gray-500/20',
  },
  divider: {
    title: 'Divider',
    category: 'Basic',
    description: 'Đường line kẻ ngăn cách thanh lịch',
    icon: <Minus size={16} />,
    color: 'bg-indigo-300/10 text-indigo-350 border-indigo-300/20',
  },
  icon: {
    title: 'Icon Symbol',
    category: 'Basic',
    description: 'Biểu tượng vector tùy chọn nhiều kích cỡ',
    icon: <Star size={16} />,
    color: 'bg-pink-500/10 text-pink-450 border-pink-500/20',
  },
};

export default function LeftSidebar({
  onAddElement,
  elements,
  selectedId,
  setSelectedId,
  onDeleteElement,
  onDuplicateElement,
}: LeftSidebarProps) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus and clear when library open status changes
  useEffect(() => {
    if (isLibraryOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150); // slight delay to wait for panel transition animation
    } else {
      setSearchQuery('');
    }
  }, [isLibraryOpen]);

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddElementWithClose = (type: ElementType) => {
    onAddElement(type);
    setIsLibraryOpen(false);
  };

  // Filter components search
  const filteredTemplates = Object.entries(ELEMENT_META).filter(([type, meta]) => {
    const term = searchQuery.toLowerCase();
    return (
      meta.title.toLowerCase().includes(term) ||
      meta.category.toLowerCase().includes(term) ||
      type.toLowerCase().includes(term)
    );
  });

  const categories = ['Layout', 'Basic', 'Content'];

  // Recursive render item tree for Navigator listing
  const renderNavTreeNode = (node: UXElement, depth: number = 0) => {
    const isSelected = selectedId === node.id;
    const isCollapsed = collapsedNodes[node.id] || false;
    const hasChildren = node.children && node.children.length > 0;
    const itemMeta = ELEMENT_META[node.type];

    return (
      <div key={node.id} className="select-none font-sans text-xs">
        {/* Row element */}
        <div
          onClick={() => setSelectedId(node.id)}
          className={`group flex items-center justify-between px-2 py-1 cursor-pointer transition-colors ${
            isSelected
              ? 'bg-blue-600 text-white font-medium shadow-sm'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${depth * 12 + 6}px` }}
        >
          <div className="flex items-center space-x-1.5 overflow-hidden mr-2">
            <span
              onClick={(e) => hasChildren ? toggleCollapse(node.id, e) : null}
              className={`p-0.5 rounded cursor-pointer hover:bg-gray-300/40 ${hasChildren ? 'opacity-100' : 'opacity-0'}`}
            >
              {isCollapsed ? <ChevronRight size={11} /> : <ChevronDown size={11} />}
            </span>

            <span className={`p-1 rounded text-[10px] ${
              isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {itemMeta ? itemMeta.icon : <FolderTree size={11} />}
            </span>

            <span className="truncate font-medium text-[11px]">{node.label || node.type}</span>
            <span className={`text-[8px] px-1 font-mono rounded ${
              isSelected ? 'text-white/75 bg-white/10' : 'text-gray-400 bg-gray-100/80'
            }`}>
              #{node.id}
            </span>
          </div>

          {/* Quick node operations */}
          <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateElement(node.id);
              }}
              className={`p-0.5 rounded ${isSelected ? 'hover:bg-blue-700 text-white' : 'hover:bg-gray-250 text-gray-500 hover:text-gray-800'}`}
              title="Duplicate"
            >
              <Copy size={10} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteElement(node.id);
              }}
              className={`p-0.5 rounded ${isSelected ? 'hover:bg-blue-700 text-white' : 'hover:bg-red-50 text-red-500'}`}
              title="Delete"
            >
              <Trash2 size={10} />
            </button>
          </div>
        </div>

        {/* Children render block */}
        {hasChildren && !isCollapsed && (
          <div className="mt-0.5 space-y-0.5">
            {node.children.map((child) => renderNavTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="ux-builder-left-sidebar" className="relative w-72 bg-white border-r border-gray-300 flex flex-col h-full text-gray-800 select-none shrink-0 font-sans overflow-hidden">
      {/* Navigator Title block Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/70 shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers size={14} className="text-gray-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-700">Navigator (Cấu Trúc)</h3>
        </div>
        <span className="text-[9px] bg-slate-100 font-mono px-2 py-0.5 rounded-full text-slate-600 font-bold border border-slate-200">
          {elements.length} items
        </span>
      </div>

      <div className="p-3 border-b border-gray-150 bg-white shrink-0">
        <button
          onClick={() => setIsLibraryOpen(!isLibraryOpen)}
          className={`w-full flex items-center justify-center space-x-2 font-bold py-2 px-3 rounded shadow-sm border border-blue-500 hover:shadow transition-all duration-200 uppercase tracking-wider text-[11px] cursor-pointer ${
            isLibraryOpen
              ? 'bg-blue-50 text-blue-600 border-blue-400'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>{isLibraryOpen ? 'Đóng thư viện' : '+ Thêm Element'}</span>
        </button>
      </div>

      {/* Main Navigator Column scroll */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-white">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase font-mono tracking-wider mb-2">
            <span>CẤU TRÚC TRANG</span>
            <span className="text-[8px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
              Flat Tree
            </span>
          </div>

          {elements.length > 0 ? (
            <div className="space-y-0.5 bg-gray-50/50 p-2 rounded-lg border border-gray-200">
              {elements.map((el) => renderNavTreeNode(el, 0))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50">
              <FolderTree size={24} className="mx-auto text-gray-300 mb-2" />
              <span className="text-[11px] text-gray-455 block font-medium">Chưa có element nào.</span>
              <button
                onClick={() => setIsLibraryOpen(true)}
                className="mt-3 text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition-colors uppercase tracking-wider cursor-pointer"
              >
                Thêm mới
              </button>
            </div>
          )}

          {elements.length > 0 && (
            <p className="text-[10px] text-gray-400 mt-4 text-center leading-relaxed">
              💡 Thêm Element để lắp ráp thiết kế mẫu hoặc nhấp chuột vào sơ đồ cây để tinh tinh chỉnh.
            </p>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded p-2 text-center shadow-sm">
          <p className="text-[9px] text-gray-500 italic">Nhấp đúp chuột lên chữ trên Canvas để đổi nhanh nội dung.</p>
        </div>
      </div>

      {/* Sliding Library Drawer Panel */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-full bg-white z-50 flex flex-col transition-all duration-300 ease-out transform ${
          isLibraryOpen
            ? 'translate-x-0 opacity-100 pointer-events-auto'
            : '-translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-gray-250 bg-gray-50 shrink-0">
          <div className="flex items-center space-x-2">
            <Plus size={14} className="text-blue-600 stroke-[2.5]" />
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-800 font-mono">
              Thư viện Elements
            </h4>
          </div>
          <button
            onClick={() => setIsLibraryOpen(false)}
            className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer border border-transparent"
            title="Đóng bảng"
          >
            <span className="text-lg font-bold leading-none mb-0.5">×</span>
          </button>
        </div>

        {/* Sticky Search bar at the top of the library panel */}
        <div className="p-3 bg-gray-50/80 border-b border-gray-200 shrink-0">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm Flatsome element..."
              className="w-full text-xs bg-white text-gray-800 border border-gray-250 rounded px-2.5 py-1.5 pl-8 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 shadow-sm"
            />
            <span className="absolute left-2.5 top-2.5 text-gray-400">
              <Search size={12} className="stroke-[2.5]" />
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-gray-450 hover:text-red-500 hover:font-bold transition-all"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        {/* Drawer Elements list (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar bg-white">

          {/* List group categories */}
          {categories.map((cat) => {
            const items = filteredTemplates.filter(([_, meta]) => meta.category === cat);
            if (items.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <h4 className="text-[10px] tracking-widest font-bold text-gray-400 uppercase font-mono">
                  {cat} Elements
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  {items.map(([type, meta]) => (
                    <div
                      key={type}
                      onClick={() => handleAddElementWithClose(type as ElementType)}
                      className="flex flex-col items-center justify-center p-2 border border-gray-200 rounded hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all group bg-white hover:shadow-sm"
                      title={meta.description}
                    >
                      <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center mb-1 text-gray-400 group-hover:text-blue-500 group-hover:bg-white transition-colors border border-transparent group-hover:border-blue-200">
                        {meta.icon}
                      </div>
                      <span className="text-[10px] text-gray-700 font-bold group-hover:text-blue-600 text-center truncate w-full">
                        {meta.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-xs font-medium">
              Không tìm thấy element phù hợp.
            </div>
          )}
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-150 text-center text-[10px] text-gray-500">
          💡 Click để thêm trực tiếp vào sơ đồ hoặc node chọn.
        </div>
      </div>
    </div>
  );
}
