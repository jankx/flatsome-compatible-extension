/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  RefreshCw,
  Code,
  FileJson,
  X,
  Check,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { ViewMode } from '../types';

interface ToolbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onOpenExport: (type: 'shortcodes' | 'html') => void;
  selectedPath: string[];
  activePreviewMode: boolean;
  setActivePreviewMode: (val: boolean) => void;
}

export default function Toolbar({
  viewMode,
  setViewMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onOpenExport,
  selectedPath,
  activePreviewMode,
  setActivePreviewMode,
}: ToolbarProps) {
  return (
    <div id="ux-builder-toolbar" className="h-11 bg-[#444] text-white flex items-center justify-between px-4 z-50 shrink-0 select-none">
      {/* Left section: Breadcrumb trail or active hierarchy */}
      <div className="flex items-center space-x-3 w-1/3">
        <div className="flex items-center gap-2 pr-3 border-r border-[#555]">
          <div className="bg-blue-500 w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-sm text-white">UX</div>
          <span className="text-xs font-semibold tracking-wide uppercase text-white">Builder</span>
        </div>

        {/* Selected element pathway */}
        <div className="hidden md:flex items-center space-x-1 text-[11px] text-gray-300 font-sans overflow-hidden max-w-[320px] whitespace-nowrap">
          <span className="hover:text-white cursor-pointer" onClick={() => onReset()}>Root</span>
          {selectedPath.map((pathItem, index) => (
            <React.Fragment key={index}>
              <span className="text-gray-500">/</span>
              <span className="bg-[#555] px-1.5 py-0.5 rounded text-gray-100 max-w-[80px] truncate font-mono">
                {pathItem}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Center: Device View Switchers */}
      <div className="flex items-center justify-center space-x-1 w-1/3">
        <button
          id="btn-viewport-desktop"
          onClick={() => setViewMode('desktop')}
          className={`p-1.5 rounded transition-colors ${
            viewMode === 'desktop'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-[#555]'
          }`}
          title="Desktop view"
        >
          <Monitor size={14} />
        </button>
        <button
          id="btn-viewport-tablet"
          onClick={() => setViewMode('tablet')}
          className={`p-1.5 rounded transition-colors ${
            viewMode === 'tablet'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-[#555]'
          }`}
          title="Tablet view"
        >
          <Tablet size={14} />
        </button>
        <button
          id="btn-viewport-mobile"
          onClick={() => setViewMode('mobile')}
          className={`p-1.5 rounded transition-colors ${
            viewMode === 'mobile'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-[#555]'
          }`}
          title="Mobile view"
        >
          <Smartphone size={14} />
        </button>

        <div className="h-4 w-[1px] bg-[#555] mx-2"></div>

        {/* Preview toggle */}
        <button
          id="btn-toggle-preview"
          onClick={() => setActivePreviewMode(!activePreviewMode)}
          className={`flex items-center space-x-1 px-2.5 py-0.5 text-[10px] uppercase tracking-wider rounded transition-all ${
            activePreviewMode
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-[#555] text-gray-200 hover:bg-[#666]'
          }`}
          title="Toggle preview hide helper outlines"
        >
          <Eye size={11} />
          <span>{activePreviewMode ? 'Editing' : 'Preview'}</span>
        </button>
      </div>

      {/* Right side: Actions, exports, and history */}
      <div className="flex items-center justify-end space-x-2 w-1/3">
        {/* Undo/Redo */}
        <button
          id="btn-undo"
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-1.5 rounded ${
            canUndo ? 'text-gray-200 hover:text-white hover:bg-[#555]' : 'text-gray-500 cursor-not-allowed'
          }`}
          title="Undo"
        >
          <Undo2 size={13} />
        </button>
        <button
          id="btn-redo"
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-1.5 rounded ${
            canRedo ? 'text-gray-200 hover:text-white hover:bg-[#555]' : 'text-gray-500 cursor-not-allowed'
          }`}
          title="Redo"
        >
          <Redo2 size={13} />
        </button>

        <div className="h-4 w-[1px] bg-[#555] mx-1"></div>

        {/* WordPress Export Formats */}
        <button
          id="btn-open-shortcodes"
          onClick={() => onOpenExport('shortcodes')}
          className="bg-[#555] hover:bg-[#666] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center space-x-1 transition-colors"
          title="Export as Flatsome Shortcode"
        >
          <FileJson size={11} />
          <span className="hidden sm:inline">Shortcodes</span>
        </button>

        <button
          id="btn-open-html"
          onClick={() => onOpenExport('html')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center space-x-1 transition-colors"
          title="Export raw static responsive HTML code"
        >
          <Code size={11} />
          <span className="hidden sm:inline">Export HTML</span>
        </button>

        <button
          id="btn-reset-canvas"
          onClick={onReset}
          className="p-1 px-2.5 bg-[#555] hover:bg-red-700 text-gray-200 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors flex items-center space-x-1"
          title="Revert template reset"
        >
          <RefreshCw size={11} />
          <span className="hidden lg:inline">Clear</span>
        </button>
      </div>
    </div>
  );
}
