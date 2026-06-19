import {createSignal, Show, For} from 'solid-js';
import {UXElement, ViewMode} from '../types';

const COL_SPANS: Record<number, string> = {1:'col-span-1',2:'col-span-2',3:'col-span-3',4:'col-span-4',5:'col-span-5',6:'col-span-6',7:'col-span-7',8:'col-span-8',9:'col-span-9',10:'col-span-10',11:'col-span-11',12:'col-span-12'};
const TABLET_SPANS: Record<number, string> = {1:'col-span-6',2:'col-span-6',3:'col-span-6',4:'col-span-6',5:'col-span-6',6:'col-span-6',7:'col-span-12',8:'col-span-12',9:'col-span-12',10:'col-span-12',11:'col-span-12',12:'col-span-12'};
const GALLERY_COLS: Record<number, string> = {2:'md:grid-cols-2',3:'md:grid-cols-3',4:'md:grid-cols-4',6:'md:grid-cols-6'};
const DIVIDER_STYLES: Record<string, string> = {solid:'border-solid',dashed:'border-dashed',dotted:'border-dotted',double:'border-double'};
const GUTTER_MAP: Record<string, string> = {none:'gap-0',small:'gap-3 md:gap-4',medium:'gap-5 md:gap-6',large:'gap-8 md:gap-10'};

function getAlignClass(align?: string) {
  if (align?.includes('left')) return 'text-left justify-start items-start';
  if (align?.includes('right')) return 'text-right justify-end items-end';
  return 'text-center justify-center items-center';
}

export default function ElementRenderer(props: {
  element: UXElement;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  viewMode: ViewMode;
  activePreviewMode: boolean;
  onDoubleClickText?: (id: string, text: string) => void;
  onAddChildElement?: (parentId: string, type: any) => void;
}) {
  const [activeSlide, setActiveSlide] = createSignal(0);
  const [isEditingText, setIsEditingText] = createSignal(false);
  const [localText, setLocalText] = createSignal('');

  const el = () => props.element;
  const isSelected = () => props.selectedId === el().id;
  const isHovered = () => props.hoveredId === el().id;

  const colSpanString = () => {
    if (el().type !== 'col' && el().type !== 'col_inner') return '';
    const span = el().props.span || 12;
    if (props.viewMode === 'mobile') return 'col-span-12';
    if (props.viewMode === 'tablet') return TABLET_SPANS[span] || 'col-span-12';
    return COL_SPANS[span] || 'col-span-12';
  };

  const handleTextBlur = () => {
    setIsEditingText(false);
    if (props.onDoubleClickText) props.onDoubleClickText(el().id, localText());
  };

  const handleTextDoubleClick = (e: MouseEvent) => {
    if (props.activePreviewMode) return;
    e.stopPropagation();
    setLocalText(el().props.text || '');
    setIsEditingText(true);
  };

  const renderContent = () => {
    const node = el();
    const {id, type, props: p, children} = node;

    switch (type) {
      case 'section': {
        const bgStyle = `background-color: ${p.bg_color || 'transparent'}; background-image: ${p.bg ? `url(${p.bg})` : 'none'}; background-size: cover; background-position: center; padding: ${p.padding || '60px 0px'};`;
        return (
          <div style={bgStyle} class={`relative w-full transition-all duration-300 ${p.class || ''}`}>
            <Show when={p.bg_overlay}><div class="absolute inset-0 z-0 pointer-events-none" style={`background-color: ${p.bg_overlay}`}></div></Show>
            <div class={`relative z-10 w-full px-4 md:px-8 mx-auto ${p.dark ? 'text-white' : ''}`}>
              <Show when={children && children.length > 0} fallback={<div class="border border-dashed border-slate-400 py-10 w-full text-center text-slate-400 text-xs rounded-xl">Section rỗng</div>}>
                <div class="space-y-4"><For each={children}>{(child) => <ElementRenderer element={child} selectedId={props.selectedId} setSelectedId={props.setSelectedId} hoveredId={props.hoveredId} setHoveredId={props.setHoveredId} viewMode={props.viewMode} activePreviewMode={props.activePreviewMode} onDoubleClickText={props.onDoubleClickText} onAddChildElement={props.onAddChildElement} />}</For></div>
              </Show>
            </div>
          </div>
        );
      }
      case 'row':
      case 'row_inner': {
        const gutterClass = GUTTER_MAP[p.gap || 'medium'];
        return (
          <div class={`grid grid-cols-12 w-full ${gutterClass} relative ${p.class || ''}`}>
            <Show when={children && children.length > 0} fallback={<div class="col-span-12 border border-dashed border-indigo-300/60 py-6 text-center text-slate-400 text-xs rounded">Row trống. Thêm Column vào đây.</div>}>
              <For each={children}>{(child) => <ElementRenderer element={child} selectedId={props.selectedId} setSelectedId={props.setSelectedId} hoveredId={props.hoveredId} setHoveredId={props.setHoveredId} viewMode={props.viewMode} activePreviewMode={props.activePreviewMode} onDoubleClickText={props.onDoubleClickText} onAddChildElement={props.onAddChildElement} />}</For>
            </Show>
            <Show when={children && children.length > 0 && !props.activePreviewMode && (isSelected() || isHovered())}>
              <div class="absolute top-1 right-2 z-20">
                <button onClick={(e) => { e.stopPropagation(); props.onAddChildElement && props.onAddChildElement(id, 'col'); }} class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded text-[9px] shadow cursor-pointer">+ Thêm Cột</button>
              </div>
            </Show>
          </div>
        );
      }
      case 'col':
      case 'col_inner': {
        const colStyle = `background-color: ${p.bg_color || 'transparent'}; padding: ${p.padding || '15px'};`;
        return (
          <div style={colStyle} class={`w-full flex flex-col justify-center rounded-lg transition-all ${getAlignClass(p.text_align || p.align)} ${p.class || ''}`}>
            <Show when={children && children.length > 0} fallback={<div class="w-full border border-dashed border-sky-300 py-8 text-center text-slate-400 text-xs rounded-lg min-h-[80px] flex items-center justify-center">+ Add Node</div>}>
              <div class="space-y-4 w-full"><For each={children}>{(child) => <ElementRenderer element={child} selectedId={props.selectedId} setSelectedId={props.setSelectedId} hoveredId={props.hoveredId} setHoveredId={props.setHoveredId} viewMode={props.viewMode} activePreviewMode={props.activePreviewMode} onDoubleClickText={props.onDoubleClickText} onAddChildElement={props.onAddChildElement} />}</For></div>
            </Show>
          </div>
        );
      }
      case 'text':
      case 'ux_text':
        return (
          <div onDblClick={handleTextDoubleClick} class={`w-full relative group transition-all ${p.class || ''}`}>
            <Show when={isEditingText()} fallback={<div class="prose max-w-none text-inherit leading-relaxed" innerHTML={p.text || 'Nhấp đúp để soạn thảo...'} />}>
              <textarea value={localText()} onInput={(e) => setLocalText(e.currentTarget.value)} onBlur={handleTextBlur} autofocus rows={4} class="w-full bg-white text-slate-900 font-mono text-xs border-2 border-blue-500 p-2 rounded shadow-inner outline-none z-40" />
            </Show>
          </div>
        );
      case 'ux_banner': {
        const bgStyle = `background-color: ${p.bg_color || 'transparent'}; background-image: ${p.bg ? `url(${p.bg})` : 'none'}; background-size: cover; background-position: center; height: ${p.height || '400px'};`;
        return (
          <div style={bgStyle} class={`relative flex items-center justify-center w-full overflow-hidden ${p.class || ''}`}>
            <Show when={p.bg_overlay}><div class="absolute inset-0" style={`background-color: ${p.bg_overlay}`}></div></Show>
            <div class={`relative z-10 w-full ${p.text_color === 'light' ? 'text-white' : ''}`}>
              <Show when={children && children.length > 0}><For each={children}>{(child) => <ElementRenderer element={child} selectedId={props.selectedId} setSelectedId={props.setSelectedId} hoveredId={props.hoveredId} setHoveredId={props.setHoveredId} viewMode={props.viewMode} activePreviewMode={props.activePreviewMode} onDoubleClickText={props.onDoubleClickText} onAddChildElement={props.onAddChildElement} />}</For></Show>
            </div>
          </div>
        );
      }
      case 'text_box':
        return (
          <div class={`p-4 text-center ${p.class || ''}`}>
            <Show when={children && children.length > 0}><For each={children}>{(child) => <ElementRenderer element={child} selectedId={props.selectedId} setSelectedId={props.setSelectedId} hoveredId={props.hoveredId} setHoveredId={props.setHoveredId} viewMode={props.viewMode} activePreviewMode={props.activePreviewMode} onDoubleClickText={props.onDoubleClickText} onAddChildElement={props.onAddChildElement} />}</For></Show>
          </div>
        );
      case 'title':
        return <h3 class={`text-xl font-bold ${p.class || ''}`}>{p.text || ''}</h3>;
      case 'button': {
        const sizeClass = p.size === 'small' ? 'px-3 py-1.5 text-xs' : p.size === 'large' || p.size === 'xlarge' ? 'px-7 py-3 text-base' : 'px-5 py-2.5 text-sm';
        return <div class={`w-full flex ${getAlignClass(p.align)} ${p.class || ''}`}><a href={p.link || '#'} class={`inline-block font-semibold text-center rounded transition-all ${sizeClass} ${p.expand ? 'w-full' : ''}`}>{p.text || 'Button'}</a></div>;
      }
      case 'featured_box':
        return (
          <div class={`text-center ${p.class || ''}`}>
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            </div>
            <h4 class="font-bold text-sm">{p.title || ''}</h4>
            <p class="text-xs text-slate-500 mt-1">{p.text || ''}</p>
          </div>
        );
      case 'ux_slider':
        return (
          <div class={`relative w-full rounded-2xl overflow-hidden ${p.class || ''}`} style={`min-height: ${p.height || '380px'};`}>
            <Show when={children && children.length > 0} fallback={<div class="flex items-center justify-center py-20 bg-slate-900 text-slate-400">Slider rỗng</div>}>
              <ElementRenderer element={children[activeSlide()]} selectedId={props.selectedId} setSelectedId={props.setSelectedId} hoveredId={props.hoveredId} setHoveredId={props.setHoveredId} viewMode={props.viewMode} activePreviewMode={props.activePreviewMode} onDoubleClickText={props.onDoubleClickText} onAddChildElement={props.onAddChildElement} />
              <Show when={p.arrows !== false}>
                <button onClick={(e) => { e.stopPropagation(); setActiveSlide((prev) => prev === 0 ? children.length - 1 : prev - 1); }} class="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full z-20 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setActiveSlide((prev) => prev === children.length - 1 ? 0 : prev + 1); }} class="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full z-20 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </Show>
              <Show when={p.bullets !== false}>
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                  <For each={children}>{(_, idx) => <button onClick={(e) => { e.stopPropagation(); setActiveSlide(idx()); }} class={`w-2.5 h-2.5 rounded-full transition-all ${activeSlide() === idx() ? 'bg-white w-6' : 'bg-white/40'}`} />}</For>
                </div>
              </Show>
            </Show>
          </div>
        );
      case 'ux_gallery':
        return <div class={p.class || ''}>Gallery ({p.columns || 3} cols)</div>;
      case 'ux_video':
        return <div class={`w-full aspect-video ${p.class || ''}`}><iframe src={p.url} class="w-full h-full rounded-xl" frameborder="0"></iframe></div>;
      case 'map':
        return <div class={`rounded-xl overflow-hidden ${p.class || ''}`} style={`height: ${p.height || '350px'};`}><iframe width="100%" height="100%" src={`https://maps.google.com/maps?q=${encodeURIComponent(p.address || 'Hanoi')}&z=${p.zoom || 14}&output=embed`} frameborder="0"></iframe></div>;
      case 'gap':
        return <div style={`height: ${p.height || '30px'};`} class={`w-full ${p.class || ''}`}></div>;
      case 'divider':
        return <div class={`w-full flex ${getAlignClass(p.align)} ${p.class || ''}`}><hr style={`border-top-width: ${p.thickness || '3px'}; border-top-color: ${p.color || '#cbd5e1'}; width: ${p.width || '100px'};`} class={`border-t ${DIVIDER_STYLES[p.style || 'solid'] || 'border-solid'}`} /></div>;
      case 'ux_image_box':
        return <div class={`text-center ${p.class || ''}`}><h4>{p.title || ''}</h4><p class="text-xs text-slate-500">{p.text || ''}</p></div>;
      case 'message_box':
        return <div style={`background-color: ${p.bg_color || '#f0f9ff'};`} class={`p-4 rounded ${p.class || ''}`}><Show when={children && children.length > 0}><For each={children}>{(child) => <ElementRenderer element={child} selectedId={props.selectedId} setSelectedId={props.setSelectedId} hoveredId={props.hoveredId} setHoveredId={props.setHoveredId} viewMode={props.viewMode} activePreviewMode={props.activePreviewMode} onDoubleClickText={props.onDoubleClickText} onAddChildElement={props.onAddChildElement} />}</For></Show></div>;
      case 'accordion':
        return <div class={`border rounded ${p.class || ''}`}><For each={children}>{(child) => <ElementRenderer element={child} selectedId={props.selectedId} setSelectedId={props.setSelectedId} hoveredId={props.hoveredId} setHoveredId={props.setHoveredId} viewMode={props.viewMode} activePreviewMode={props.activePreviewMode} onDoubleClickText={props.onDoubleClickText} onAddChildElement={props.onAddChildElement} />}</For></div>;
      case 'accordion-item':
        return <details class="border-b p-2"><summary class="font-bold cursor-pointer">{p.title || 'Accordion'}</summary><div class="p-2"><Show when={children && children.length > 0}><For each={children}>{(child) => <ElementRenderer element={child} selectedId={props.selectedId} setSelectedId={props.setSelectedId} hoveredId={props.hoveredId} setHoveredId={props.setHoveredId} viewMode={props.viewMode} activePreviewMode={props.activePreviewMode} onDoubleClickText={props.onDoubleClickText} onAddChildElement={props.onAddChildElement} />}</For></Show></div></details>;
      case 'tabgroup':
        return <div class={p.class || ''}><For each={children}>{(child) => <ElementRenderer element={child} selectedId={props.selectedId} setSelectedId={props.setSelectedId} hoveredId={props.hoveredId} setHoveredId={props.setHoveredId} viewMode={props.viewMode} activePreviewMode={props.activePreviewMode} onDoubleClickText={props.onDoubleClickText} onAddChildElement={props.onAddChildElement} />}</For></div>;
      case 'tab':
        return <div class="inline-block px-4 py-2 border-b-2 border-blue-500 font-bold text-sm">{p.title || 'Tab'}</div>;
      default:
        return <div class="text-xs text-slate-400 p-2">Element: {type}</div>;
    }
  };

  const handleSelect = (e: MouseEvent) => { e.stopPropagation(); props.setSelectedId(el().id); };
  const handleMouseEnter = () => { if (!props.activePreviewMode) props.setHoveredId(el().id); };
  const handleMouseLeave = () => { if (!props.activePreviewMode) props.setHoveredId(null); };

  const type = () => el().type;

  if (props.activePreviewMode) {
    return <div onClick={handleSelect} class={colSpanString()}>{renderContent()}</div>;
  }

  return (
    <div onClick={handleSelect} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      class={`${colSpanString()} relative transition-all ${isSelected() ? 'outline-2 outline-blue-500 outline-solid ring-2 ring-blue-500/10 shadow-sm' : isHovered() ? 'outline-1 outline-blue-400/70 outline-dashed' : 'outline-1 outline-transparent'}`}
      style="cursor: pointer; min-width: 20px;"
    >
      <Show when={isHovered() && !isSelected()}>
        <span class="absolute left-0 top-0 -translate-y-4 bg-blue-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-t z-40 shadow pointer-events-none uppercase font-mono">{type()}</span>
      </Show>
      <Show when={isSelected()}>
        <span class="absolute left-0 top-0 -translate-y-4 bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-t z-40 shadow pointer-events-none uppercase font-mono flex items-center space-x-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse"></span>
          <span>{type()}</span>
        </span>
      </Show>
      {renderContent()}
    </div>
  );
}
