import {For, Show, createSignal, createEffect, createMemo} from 'solid-js';
import {ElementType, UXElement, ELEMENT_CATEGORIES} from '../types';

const ELEMENT_META: Record<string, {title: string; category: string; description: string; color: string}> = {
  section: {title: 'Section', category: 'Layout', description: 'Container với background và padding', color: 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20'},
  row: {title: 'Row', category: 'Layout', description: 'Hàng lưới 12 cột', color: 'bg-blue-500/10 text-blue-450 border-blue-500/20'},
  row_inner: {title: 'Row Inner', category: 'Layout', description: 'Row lồng bên trong', color: 'bg-blue-400/10 text-blue-400 border-blue-400/20'},
  col: {title: 'Column', category: 'Layout', description: 'Cột (1-12 span)', color: 'bg-indigo-500/10 text-indigo-450 border-indigo-500/20'},
  col_inner: {title: 'Col Inner', category: 'Layout', description: 'Cột lồng bên trong', color: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/20'},
  ux_banner: {title: 'Banner', category: 'Banners & Sliders', description: 'Banner với background và text overlay', color: 'bg-rose-500/10 text-rose-450 border-rose-500/20'},
  text_box: {title: 'Text Box', category: 'Banners & Sliders', description: 'Text box định vị trong banner', color: 'bg-orange-500/10 text-orange-450 border-orange-500/20'},
  text: {title: 'Text', category: 'Content', description: 'Nội dung văn bản HTML', color: 'bg-amber-500/10 text-amber-450 border-amber-500/20'},
  ux_text: {title: 'UX Text', category: 'Content', description: 'Text với tùy chọn định dạng', color: 'bg-amber-400/10 text-amber-400 border-amber-400/20'},
  title: {title: 'Title', category: 'Content', description: 'Tiêu đề section', color: 'bg-yellow-500/10 text-yellow-450 border-yellow-500/20'},
  ux_image: {title: 'Image', category: 'Content', description: 'Hình ảnh với hiệu ứng', color: 'bg-purple-500/10 text-purple-450 border-purple-500/20'},
  button: {title: 'Button', category: 'Interactive', description: 'Nút bấm', color: 'bg-rose-500/10 text-rose-450 border-rose-500/20'},
  featured_box: {title: 'Feature Box', category: 'Banners & Sliders', description: 'Hộp tính năng với icon', color: 'bg-teal-500/10 text-teal-450 border-teal-500/20'},
  ux_slider: {title: 'Slider', category: 'Banners & Sliders', description: 'Trình chiếu slide', color: 'bg-cyan-500/10 text-cyan-450 border-cyan-500/20'},
  ux_gallery: {title: 'Gallery', category: 'Content', description: 'Thư viện ảnh dạng lưới', color: 'bg-teal-500/10 text-teal-450 border-teal-500/20'},
  ux_video: {title: 'Video', category: 'Content', description: 'Video YouTube embed', color: 'bg-red-500/10 text-red-450 border-red-500/20'},
  map: {title: 'Map', category: 'Content', description: 'Google Maps', color: 'bg-lime-500/10 text-lime-450 border-lime-500/20'},
  gap: {title: 'Gap', category: 'Layout', description: 'Khoảng trống dọc', color: 'bg-gray-500/10 text-gray-450 border-gray-500/20'},
  divider: {title: 'Divider', category: 'Layout', description: 'Đường kẻ ngang', color: 'bg-indigo-300/10 text-indigo-350 border-indigo-300/20'},
  scroll_to: {title: 'Scroll To', category: 'Interactive', description: 'Điểm neo cuộn', color: 'bg-slate-500/10 text-slate-450 border-slate-500/20'},
  accordion: {title: 'Accordion', category: 'Interactive', description: 'Accordion container', color: 'bg-pink-500/10 text-pink-450 border-pink-500/20'},
  'accordion-item': {title: 'Accordion Item', category: 'Interactive', description: 'Mục accordion', color: 'bg-pink-400/10 text-pink-400 border-pink-400/20'},
  tabgroup: {title: 'Tab Group', category: 'Interactive', description: 'Container tabs', color: 'bg-violet-500/10 text-violet-450 border-violet-500/20'},
  tab: {title: 'Tab', category: 'Interactive', description: 'Tab riêng lẻ', color: 'bg-violet-400/10 text-violet-400 border-violet-400/20'},
  block: {title: 'Block', category: 'Layout', description: 'Block tái sử dụng', color: 'bg-gray-500/10 text-gray-450 border-gray-500/20'},
  message_box: {title: 'Message Box', category: 'Content', description: 'Hộp thông báo', color: 'bg-blue-300/10 text-blue-350 border-blue-300/20'},
  ux_countdown: {title: 'Countdown', category: 'Interactive', description: 'Đếm ngược thời gian', color: 'bg-orange-400/10 text-orange-400 border-orange-400/20'},
  share: {title: 'Share', category: 'Interactive', description: 'Chia sẻ MXH', color: 'bg-sky-500/10 text-sky-450 border-sky-500/20'},
  follow: {title: 'Follow', category: 'Interactive', description: 'Theo dõi MXH', color: 'bg-sky-600/10 text-sky-550 border-sky-600/20'},
  search: {title: 'Search', category: 'Content', description: 'Ô tìm kiếm', color: 'bg-gray-500/10 text-gray-450 border-gray-500/20'},
  ux_logo: {title: 'Logo', category: 'Content', description: 'Logo với hiệu ứng hover', color: 'bg-gray-600/10 text-gray-550 border-gray-600/20'},
  ux_image_box: {title: 'Image Box', category: 'Content', description: 'Ảnh kèm chú thích', color: 'bg-purple-400/10 text-purple-400 border-purple-400/20'},
};

function NavTreeNode(props: {node: UXElement; depth: number; selectedId: string | null; setSelectedId: (id: string | null) => void; onDelete: (id: string) => void; onDuplicate: (id: string) => void; collapsed: Record<string, boolean>; toggleCollapse: (id: string) => void}) {
  const isSelected = () => props.selectedId === props.node.id;
  const isCollapsed = () => props.collapsed[props.node.id];
  const hasChildren = () => props.node.children && props.node.children.length > 0;
  const meta = () => ELEMENT_META[props.node.type] || {title: props.node.type, category: '', description: '', color: 'bg-gray-500/10 text-gray-450'};

  return (
    <div class="select-none font-sans text-xs">
      <div
        onClick={() => props.setSelectedId(props.node.id)}
        class={`group flex items-center justify-between px-2 py-1 cursor-pointer transition-colors ${isSelected() ? 'bg-blue-600 text-white font-medium shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
        style={{"padding-left": `${props.depth * 12 + 6}px`}}
      >
        <div class="flex items-center space-x-1.5 overflow-hidden mr-2">
          <span onClick={(e) => { e.stopPropagation(); if (hasChildren()) props.toggleCollapse(props.node.id); }} class={`p-0.5 rounded cursor-pointer ${hasChildren() ? 'opacity-100' : 'opacity-0'}`}>
            {isCollapsed()
              ? <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            }
          </span>
          <span class={`p-1 rounded text-[10px] ${isSelected() ? 'bg-white/20 text-white' : meta().color.split(' ').slice(0, 2).join(' ')}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 7h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"/></svg>
          </span>
          <span class="truncate font-medium text-[11px]">{props.node.label || props.node.type}</span>
        </div>
        <div class="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); props.onDuplicate(props.node.id); }} class={`p-0.5 rounded ${isSelected() ? 'hover:bg-blue-700 text-white' : 'hover:bg-gray-250 text-gray-500'}`} title="Duplicate">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="8" height="4" x="10" y="2" rx="1"/><path d="M16 7h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); props.onDelete(props.node.id); }} class={`p-0.5 rounded ${isSelected() ? 'hover:bg-blue-700 text-white' : 'hover:bg-red-50 text-red-500'}`} title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
          </button>
        </div>
      </div>
      <Show when={hasChildren() && !isCollapsed()}>
        <div class="mt-0.5 space-y-0.5">
          <For each={props.node.children}>{(child) => (
            <NavTreeNode node={child} depth={props.depth + 1} selectedId={props.selectedId} setSelectedId={props.setSelectedId} onDelete={props.onDelete} onDuplicate={props.onDuplicate} collapsed={props.collapsed} toggleCollapse={props.toggleCollapse} />
          )}</For>
        </div>
      </Show>
    </div>
  );
}

export default function LeftSidebar(props: {
  onAddElement: (type: ElementType) => void;
  elements: UXElement[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}) {
  const [isLibraryOpen, setIsLibraryOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [collapsedNodes, setCollapsedNodes] = createSignal<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => {
    setCollapsedNodes((prev) => ({...prev, [id]: !prev[id]}));
  };

  const filteredCategories = createMemo(() => {
    const q = searchQuery().toLowerCase();
    const result: {catKey: string; catLabel: string; items: string[]}[] = [];

    for (const [catKey, cat] of Object.entries(ELEMENT_CATEGORIES)) {
      const filtered = cat.types.filter((t) => {
        const meta = ELEMENT_META[t];
        if (!meta) return false;
        return meta.title.toLowerCase().includes(q) || meta.category.toLowerCase().includes(q) || t.toLowerCase().includes(q);
      });
      if (filtered.length > 0) {
        result.push({catKey, catLabel: cat.label, items: filtered});
      }
    }
    return result;
  });

  return (
    <div id="ux-builder-left-sidebar" class="relative w-72 bg-white border-r border-gray-300 flex flex-col h-full text-gray-800 select-none shrink-0 font-sans overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 bg-gray-50/70 shrink-0 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <h3 class="text-[11px] font-bold uppercase tracking-wider text-gray-700">Navigator</h3>
        </div>
        <span class="text-[9px] bg-slate-100 font-mono px-2 py-0.5 rounded-full text-slate-600 font-bold border border-slate-200">{props.elements.length} items</span>
      </div>

      <div class="p-3 border-b border-gray-150 bg-white shrink-0">
        <button onClick={() => setIsLibraryOpen(!isLibraryOpen())} class={`w-full flex items-center justify-center space-x-2 font-bold py-2 px-3 rounded shadow-sm border border-blue-500 transition-all duration-200 uppercase tracking-wider text-[11px] cursor-pointer ${isLibraryOpen() ? 'bg-blue-50 text-blue-600 border-blue-400' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
          <span>{isLibraryOpen() ? 'Đóng thư viện' : '+ Thêm Element'}</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-3 custom-scrollbar bg-white">
        <div class="space-y-1">
          <Show
            when={props.elements.length > 0}
            fallback={
              <div class="text-center py-10 border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50">
                <p class="text-[11px] text-gray-455 block font-medium">Chưa có element nào.</p>
                <button onClick={() => setIsLibraryOpen(true)} class="mt-3 text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition-colors uppercase tracking-wider cursor-pointer">Thêm mới</button>
              </div>
            }
          >
            <div class="space-y-0.5 bg-gray-50/50 p-2 rounded-lg border border-gray-200">
              <For each={props.elements}>{(el) => (
                <NavTreeNode node={el} depth={0} selectedId={props.selectedId} setSelectedId={props.setSelectedId} onDelete={props.onDeleteElement} onDuplicate={props.onDuplicateElement} collapsed={collapsedNodes()} toggleCollapse={toggleCollapse} />
              )}</For>
            </div>
          </Show>
        </div>
      </div>

      <div class={`absolute top-0 bottom-0 left-0 w-full bg-white z-50 flex flex-col transition-all duration-300 ease-out transform ${isLibraryOpen() ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'}`}>
        <div class="flex items-center justify-between p-3.5 border-b border-gray-250 bg-gray-50 shrink-0">
          <h4 class="text-[11px] font-extrabold uppercase tracking-widest text-slate-800 font-mono">Thư viện Elements</h4>
          <button onClick={() => setIsLibraryOpen(false)} class="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer border border-transparent"><span class="text-lg font-bold leading-none mb-0.5">&times;</span></button>
        </div>

        <div class="p-3 bg-gray-50/80 border-b border-gray-200 shrink-0">
          <input type="text" value={searchQuery()} onInput={(e) => setSearchQuery(e.currentTarget.value)} placeholder="Tìm kiếm element..." class="w-full text-xs bg-white text-gray-800 border border-gray-250 rounded px-2.5 py-1.5 pl-8 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 shadow-sm" />
        </div>

        <div class="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar bg-white">
          <For each={filteredCategories()}>{(cat) => (
            <div class="space-y-2">
              <h4 class="text-[10px] tracking-widest font-bold text-gray-400 uppercase font-mono">{cat.catLabel}</h4>
              <div class="grid grid-cols-2 gap-2">
                <For each={cat.items}>{(type) => {
                  const meta = ELEMENT_META[type] || {title: type, category: '', description: '', color: 'bg-gray-500/10'};
                  return (
                    <div onClick={() => { props.onAddElement(type as ElementType); setIsLibraryOpen(false); }} class="flex flex-col items-center justify-center p-2 border border-gray-200 rounded hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all group bg-white hover:shadow-sm" title={meta.description}>
                      <span class="text-[10px] text-gray-700 font-bold group-hover:text-blue-600 text-center truncate w-full">{meta.title}</span>
                    </div>
                  );
                }}</For>
              </div>
            </div>
          )}</For>
        </div>
      </div>
    </div>
  );
}
