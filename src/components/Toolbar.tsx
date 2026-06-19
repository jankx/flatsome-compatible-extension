import {For, Show} from 'solid-js';
import {ViewMode} from '../types';

export default function Toolbar(props: {
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
}) {
  return (
    <div id="ux-builder-toolbar" class="h-11 bg-[#444] text-white flex items-center justify-between px-4 z-50 shrink-0 select-none">
      <div class="flex items-center space-x-3 w-1/3">
        <div class="flex items-center gap-2 pr-3 border-r border-[#555]">
          <div class="bg-blue-500 w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-sm text-white">UX</div>
          <span class="text-xs font-semibold tracking-wide uppercase text-white">Builder</span>
        </div>
        <div class="hidden md:flex items-center space-x-1 text-[11px] text-gray-300 font-sans overflow-hidden max-w-[320px] whitespace-nowrap">
          <span class="hover:text-white cursor-pointer" onClick={props.onReset}>Root</span>
          <For each={props.selectedPath}>{(pathItem) => (
            <><span class="text-gray-500">/</span><span class="bg-[#555] px-1.5 py-0.5 rounded text-gray-100 max-w-[80px] truncate font-mono">{pathItem}</span></>
          )}</For>
        </div>
      </div>

      <div class="flex items-center justify-center space-x-1 w-1/3">
        <button onClick={() => props.setViewMode('desktop')} class={`p-1.5 rounded transition-colors ${props.viewMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-[#555]'}`} title="Desktop">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
        </button>
        <button onClick={() => props.setViewMode('tablet')} class={`p-1.5 rounded transition-colors ${props.viewMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-[#555]'}`} title="Tablet">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>
        </button>
        <button onClick={() => props.setViewMode('mobile')} class={`p-1.5 rounded transition-colors ${props.viewMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-[#555]'}`} title="Mobile">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>
        </button>
        <div class="h-4 w-[1px] bg-[#555] mx-2"></div>
        <button onClick={() => props.setActivePreviewMode(!props.activePreviewMode)} class={`flex items-center space-x-1 px-2.5 py-0.5 text-[10px] uppercase tracking-wider rounded transition-all ${props.activePreviewMode ? 'bg-blue-600 text-white font-bold' : 'bg-[#555] text-gray-200 hover:bg-[#666]'}`} title="Toggle preview">
          <span>{props.activePreviewMode ? 'Editing' : 'Preview'}</span>
        </button>
      </div>

      <div class="flex items-center justify-end space-x-2 w-1/3">
        <button onClick={props.onUndo} disabled={!props.canUndo} class={`p-1.5 rounded ${props.canUndo ? 'text-gray-200 hover:text-white hover:bg-[#555]' : 'text-gray-500 cursor-not-allowed'}`} title="Undo">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </button>
        <button onClick={props.onRedo} disabled={!props.canRedo} class={`p-1.5 rounded ${props.canRedo ? 'text-gray-200 hover:text-white hover:bg-[#555]' : 'text-gray-500 cursor-not-allowed'}`} title="Redo">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
        </button>
        <div class="h-4 w-[1px] bg-[#555] mx-1"></div>
        <button onClick={() => props.onOpenExport('shortcodes')} class="bg-[#555] hover:bg-[#666] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center space-x-1 transition-colors"><span class="hidden sm:inline">Shortcodes</span></button>
        <button onClick={() => props.onOpenExport('html')} class="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center space-x-1 transition-colors"><span class="hidden sm:inline">Export HTML</span></button>
        <button onClick={props.onReset} class="p-1 px-2.5 bg-[#555] hover:bg-red-700 text-gray-200 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors flex items-center space-x-1"><span class="hidden lg:inline">Clear</span></button>
      </div>
    </div>
  );
}
