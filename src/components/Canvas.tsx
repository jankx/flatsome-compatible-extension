import {For, Show, createSignal, createEffect, onCleanup, createMemo} from 'solid-js';
import {UXElement, ViewMode, ElementType} from '../types';
import ElementRenderer from './ElementRenderer';

function InsertionBar(props: {index: number; onInsertElement: (type: ElementType, index: number) => void; activePreviewMode: boolean}) {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <Show when={!props.activePreviewMode}>
      <div class="relative group/insert py-1 flex justify-center items-center h-10 transition-all select-none col-span-12 w-full">
        <div class="absolute inset-x-0 h-[1.5px] bg-[#e2e8f0] group-hover/insert:bg-blue-400/80 transition-colors pointer-events-none"></div>
        <Show
          when={!isOpen()}
          fallback={
            <div class="relative z-10 bg-white border border-blue-200 rounded-lg shadow-md p-2 flex items-center space-x-2 animate-fade-in divide-x divide-slate-100 border-dashed">
              <div class="flex items-center space-x-1.5 pr-2">
                <span class="text-[10px] uppercase font-mono font-extrabold text-blue-600 tracking-wide">Chèn:</span>
              </div>
              <div class="flex items-center space-x-1.5 pl-2 gap-1 bg-white">
                <button onClick={() => { props.onInsertElement('section', props.index); setIsOpen(false); }} class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-250 text-emerald-700 hover:border-emerald-600 rounded text-[10px] font-bold transition-all shadow-sm flex items-center cursor-pointer">+ Section</button>
                <button onClick={() => { props.onInsertElement('row', props.index); setIsOpen(false); }} class="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-250 text-blue-700 hover:border-blue-600 rounded text-[10px] font-bold transition-all shadow-sm flex items-center cursor-pointer">+ Row</button>
                <button onClick={() => { props.onInsertElement('gap', props.index); setIsOpen(false); }} class="px-2.5 py-1 bg-slate-50 hover:bg-slate-600 hover:text-white border border-slate-250 text-slate-700 hover:border-slate-600 rounded text-[10px] font-bold transition-all shadow-sm flex items-center cursor-pointer">+ Gap</button>
                <button onClick={() => { props.onInsertElement('divider', props.index); setIsOpen(false); }} class="px-2.5 py-1 bg-purple-50 hover:bg-purple-600 hover:text-white border border-purple-255 text-purple-700 hover:border-purple-600 rounded text-[10px] font-bold transition-all shadow-sm flex items-center cursor-pointer">+ Divider</button>
              </div>
              <div class="pl-2">
                <button onClick={() => setIsOpen(false)} class="px-2 py-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded text-[10px] font-bold transition-all cursor-pointer">Đóng</button>
              </div>
            </div>
          }
        >
          <button
            onClick={() => setIsOpen(true)}
            class="relative z-10 bg-white border border-slate-205 group-hover/insert:border-blue-500 group-hover/insert:bg-blue-500 group-hover/insert:text-white text-slate-600 h-6 px-3.5 rounded-full text-[10px] font-bold shadow-sm hover:shadow transition-all flex items-center space-x-1 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span class="text-sm font-semibold opacity-80 leading-none mb-0.5">+</span>
            <span>Chèn layout ở đây</span>
          </button>
        </Show>
      </div>
    </Show>
  );
}

export default function Canvas(props: {
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
}) {
  const getViewportWidthClass = () => {
    if (props.viewMode === 'mobile') return 'max-w-[375px] border-[10px] border-slate-900 rounded-[36px] shadow-2xl';
    if (props.viewMode === 'tablet') return 'max-w-[768px] border-[8px] border-slate-800 rounded-[20px] shadow-xl';
    return 'max-w-full';
  };

  const handleCanvasOutsideClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement) === e.currentTarget) {
      props.setSelectedId(null);
    }
  };

  return (
    <div
      id="ux-builder-canvas-wrapper"
      onClick={handleCanvasOutsideClick}
      class="flex-1 bg-[#f1f3f5] overflow-y-auto p-6 flex justify-center items-start custom-scrollbar select-none"
    >
      <div
        id="ux-builder-viewport"
        class={`w-full bg-white transition-all duration-300 min-h-[82vh] relative ${getViewportWidthClass()} ${props.viewMode !== 'desktop' ? 'my-3 border-neutral-800' : ''}`}
      >
        <Show when={props.viewMode === 'mobile'}>
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-b-xl z-50 flex items-center justify-center">
            <div class="w-10 h-1 bg-slate-800 rounded-full mb-1"></div>
          </div>
        </Show>
        <Show when={props.viewMode === 'tablet'}>
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-850 rounded-full z-50 mt-1"></div>
        </Show>

        <div class={`w-full h-full ${props.viewMode === 'mobile' ? 'pt-6 pb-2.5 rounded-[26px]' : props.viewMode === 'tablet' ? 'pt-4 rounded-[12px]' : ''} overflow-x-hidden bg-white`}>
          <Show
            when={props.elements.length > 0}
            fallback={
              <div class="flex flex-col items-center justify-center py-20 px-8 text-center min-h-[70vh] max-w-lg mx-auto">
                <div class="p-5 bg-blue-50 text-blue-600 rounded-full shadow border border-blue-150 mb-6 scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="14" y="3" rx="1"/><path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/></svg>
                </div>
                <h2 class="text-xl font-bold tracking-tight text-slate-850">Giao Diện Thiết Kế Flatsome UX</h2>
                <p class="text-xs text-slate-500 mt-2.5 leading-relaxed">Canvas của bạn hiện chưa có cấu trúc. Hãy thêm các element Layout hoặc nội dung từ thanh công cụ bên trái để bắt đầu.</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-8">
                  <button onClick={props.onLoadMock} class="p-3 border border-blue-500/30 bg-blue-500/5 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold text-blue-600 transition-all flex items-center justify-center space-x-2"><span>Tải Mẫu Landing Page</span></button>
                  <button onClick={() => props.onAddElement('section')} class="p-3 border border-slate-350 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center justify-center space-x-2"><span>Thêm Section Mới</span></button>
                </div>
              </div>
            }
          >
            <div class="w-full">
              <InsertionBar index={0} onInsertElement={props.onInsertElement} activePreviewMode={props.activePreviewMode} />
              <For each={props.elements}>
                {(el, idx) => (
                  <>
                    <ElementRenderer
                      element={el}
                      selectedId={props.selectedId}
                      setSelectedId={props.setSelectedId}
                      hoveredId={props.hoveredId}
                      setHoveredId={props.setHoveredId}
                      viewMode={props.viewMode}
                      activePreviewMode={props.activePreviewMode}
                      onDoubleClickText={(id, updatedText) => props.onUpdateProps(id, {text: updatedText})}
                      onAddChildElement={props.onAddChildElement}
                    />
                    <InsertionBar index={idx() + 1} onInsertElement={props.onInsertElement} activePreviewMode={props.activePreviewMode} />
                  </>
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
