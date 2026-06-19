import {Show, For} from 'solid-js';
import {UXElement, ElementType} from '../types';

export default function RightSidebar(props: {
  selectedElement: UXElement | null;
  onUpdateProps: (id: string, newProps: Record<string, any>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onAddChildElement?: (parentId: string, type: ElementType) => void;
}) {
  const colors = [
    {name: 'Trong suốt', value: 'rgba(0,0,0,0)'},
    {name: 'Tối (Slate)', value: '#0f172a'},
    {name: 'Xanh Slate', value: '#1e293b'},
    {name: 'Teal', value: '#0d9488'},
    {name: 'Xanh Lam', value: '#2b82f6'},
    {name: 'Đỏ Ruby', value: '#ef4444'},
    {name: 'Vàng Amber', value: '#f59e0b'},
    {name: 'Trắng', value: '#ffffff'},
    {name: 'Sữa nhạt', value: '#f8fafc'},
  ];

  const handleChange = (key: string, value: any) => {
    if (!props.selectedElement) return;
    props.onUpdateProps(props.selectedElement.id, {[key]: value});
  };

  const el = () => props.selectedElement;

  return (
    <Show
      when={el()}
      fallback={
        <div id="ux-builder-right-sidebar" class="w-[300px] bg-white border-l border-gray-300 flex flex-col items-center justify-center text-center p-6 h-full text-gray-400 select-none font-sans shrink-0">
          <h3 class="text-xs font-bold uppercase tracking-wider text-gray-800">Không có element</h3>
          <p class="text-[11px] text-gray-500 mt-2">Chọn một element trên Canvas để chỉnh sửa.</p>
        </div>
      }
    >
      <div id="ux-builder-right-sidebar" class="w-[300px] bg-white border-l border-gray-300 flex flex-col h-full overflow-hidden text-gray-800 select-none shrink-0 font-sans">
        <div class="px-3.5 py-2.5 bg-gray-50 border-b border-gray-300 flex items-center justify-between shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-0.5 px-1.5 bg-blue-50 border border-blue-100 rounded text-[9px] text-blue-650 uppercase font-mono font-bold">{el()!.type}</span>
            <h3 class="text-[11px] font-bold uppercase tracking-wider text-gray-800">Chỉnh Sửa</h3>
          </div>
          <div class="flex items-center space-x-1">
            <button onClick={() => props.onDuplicateElement(el()!.id)} class="p-1.5 bg-white border border-gray-200 text-gray-500 hover:text-gray-800 rounded hover:bg-gray-100/50 transition-colors" title="Nhân bản">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="8" height="4" x="10" y="2" rx="1"/><path d="M16 7h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"/></svg>
            </button>
            <button onClick={() => props.onDeleteElement(el()!.id)} class="p-1.5 bg-white border border-gray-200 text-gray-550 hover:text-red-500 rounded hover:bg-red-50 transition-colors" title="Xóa">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar text-[11px] bg-white">
          <div class="bg-gray-50/50 p-2.5 rounded border border-gray-200 space-y-1.5">
            <label class="text-[9px] uppercase font-mono font-bold text-gray-450 block">Tên element</label>
            <input type="text" value={el()!.label || ''} onInput={(e) => handleChange('label', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] focus:outline-none focus:border-blue-500" />
          </div>

          <Show when={el()!.type === 'section'}>
            <SectionEditor el={el()!} colors={colors} handleChange={handleChange} />
          </Show>
          <Show when={el()!.type === 'row' || el()!.type === 'row_inner'}>
            <RowEditor el={el()!} handleChange={handleChange} onAddChildElement={props.onAddChildElement} />
          </Show>
          <Show when={el()!.type === 'col' || el()!.type === 'col_inner'}>
            <ColEditor el={el()!} handleChange={handleChange} />
          </Show>
          <Show when={el()!.type === 'text' || el()!.type === 'ux_text'}>
            <TextEditor el={el()!} handleChange={handleChange} />
          </Show>
          <Show when={el()!.type === 'ux_image'}>
            <ImageEditor el={el()!} handleChange={handleChange} />
          </Show>
          <Show when={el()!.type === 'button'}>
            <ButtonEditor el={el()!} handleChange={handleChange} />
          </Show>
          <Show when={el()!.type === 'featured_box'}>
            <FeatureBoxEditor el={el()!} handleChange={handleChange} />
          </Show>
          <Show when={el()!.type === 'gap'}>
            <div class="space-y-1.5"><label class="text-gray-600 block">Chiều cao (height)</label><input type="text" value={el()!.props.height || '30px'} onInput={(e) => handleChange('height', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
          </Show>
          <Show when={el()!.type === 'divider'}>
            <div class="space-y-2">
              <div class="space-y-1.5"><label>Width</label><input type="text" value={el()!.props.width || '100px'} onInput={(e) => handleChange('width', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
              <div class="space-y-1.5"><label>Thickness</label><input type="text" value={el()!.props.thickness || '3px'} onInput={(e) => handleChange('thickness', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
              <div class="space-y-1.5"><label>Color</label><input type="text" value={el()!.props.color || '#cbd5e1'} onInput={(e) => handleChange('color', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
            </div>
          </Show>
          <Show when={el()!.type === 'ux_slider'}>
            <div class="space-y-2">
              <div class="space-y-1.5"><label>Height</label><input type="text" value={el()!.props.height || '400px'} onInput={(e) => handleChange('height', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
              <div class="flex items-center space-x-2"><input type="checkbox" checked={el()!.props.auto_slide || false} onChange={(e) => handleChange('auto_slide', e.currentTarget.checked)} /><label>Auto slide</label></div>
            </div>
          </Show>
          <Show when={el()!.type === 'ux_video'}>
            <div class="space-y-1.5"><label>Video URL</label><input type="text" value={el()!.props.url || ''} onInput={(e) => handleChange('url', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
          </Show>
          <Show when={el()!.type === 'map'}>
            <div class="space-y-2">
              <div class="space-y-1.5"><label>Address</label><input type="text" value={el()!.props.address || ''} onInput={(e) => handleChange('address', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
              <div class="space-y-1.5"><label>Zoom</label><input type="number" value={el()!.props.zoom || 14} onInput={(e) => handleChange('zoom', parseInt(e.currentTarget.value) || 14)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
            </div>
          </Show>
          <Show when={el()!.type === 'title'}>
            <div class="space-y-2">
              <div class="space-y-1.5"><label>Text</label><input type="text" value={el()!.props.text || ''} onInput={(e) => handleChange('text', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
              <div class="space-y-1.5"><label>Style</label><select value={el()!.props.style || 'lined'} onChange={(e) => handleChange('style', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1"><option value="lined">Lined</option><option value="simple">Simple</option><option value="bold">Bold</option></select></div>
            </div>
          </Show>

          <Show when={el()!.type === 'ux_banner'}>
            <BannerEditor el={el()!} colors={colors} handleChange={handleChange} />
          </Show>
          <Show when={el()!.type === 'text_box'}>
            <div class="space-y-2">
              <div class="space-y-1.5"><label>Width (%)</label><input type="text" value={el()!.props.width || '60'} onInput={(e) => handleChange('width', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
              <div class="space-y-1.5"><label>Text Align</label><select value={el()!.props.text_align || 'center'} onChange={(e) => handleChange('text_align', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
            </div>
          </Show>
          <Show when={el()!.type === 'ux_gallery'}>
            <div class="space-y-1.5"><label>Columns</label><select value={el()!.props.columns || '3'} onChange={(e) => handleChange('columns', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1"><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="6">6</option></select></div>
          </Show>
          <Show when={el()!.type === 'accordion'}>
            <div class="space-y-2">
              <div class="flex items-center space-x-2"><input type="checkbox" checked={el()!.props.auto_open || false} onChange={(e) => handleChange('auto_open', e.currentTarget.checked)} /><label>Auto open</label></div>
              <div class="flex items-center space-x-2"><input type="checkbox" checked={el()!.props.open_multi || false} onChange={(e) => handleChange('open_multi', e.currentTarget.checked)} /><label>Open multi</label></div>
            </div>
          </Show>

          <div class="pt-3 border-t border-gray-200">
            <div class="space-y-1">
              <label class="text-gray-500 block text-[10px]">Custom CSS Class</label>
              <input type="text" value={el()!.props.class || ''} onInput={(e) => handleChange('class', e.currentTarget.value)} placeholder="e.g. custom-class" class="w-full bg-white border border-gray-250 rounded px-2 py-1 text-gray-800 text-[11px] font-mono" />
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}

function SectionEditor(props: {el: UXElement; colors: {name: string; value: string}[]; handleChange: (k: string, v: any) => void}) {
  return (
    <div class="space-y-3.5">
      <h4 class="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">SECTION SETTINGS</h4>
      <div class="space-y-1.5"><label class="text-gray-600 block">Padding</label><input type="text" value={props.el.props.padding || '60px 0px'} onInput={(e) => props.handleChange('padding', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" placeholder="top right bottom left" /></div>
      <div class="space-y-1.5"><label class="text-gray-600 block">Background Color</label>
        <div class="grid grid-cols-5 gap-1">{props.colors.map((c) => <button onClick={() => props.handleChange('bg_color', c.value)} class={`h-5 rounded border ${props.el.props.bg_color === c.value ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-205'}`} style={`background-color: ${c.value === 'rgba(0,0,0,0)' ? 'transparent' : c.value};`} title={c.name}><Show when={c.value === 'rgba(0,0,0,0)'}><span class="text-[9px] text-gray-400">X</span></Show></button>)}</div>
      </div>
      <div class="space-y-1.5"><label class="text-gray-600 block">Background Image URL</label><input type="text" value={props.el.props.bg || ''} onInput={(e) => props.handleChange('bg', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
      <div class="space-y-1.5"><label class="text-gray-600 block">Overlay</label><input type="text" value={props.el.props.bg_overlay || ''} onInput={(e) => props.handleChange('bg_overlay', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
      <div class="flex items-center space-x-2"><input type="checkbox" checked={props.el.props.dark || false} onChange={(e) => props.handleChange('dark', e.currentTarget.checked)} /><label>Dark mode (text light)</label></div>
    </div>
  );
}

function RowEditor(props: {el: UXElement; handleChange: (k: string, v: any) => void; onAddChildElement?: (parentId: string, type: ElementType) => void}) {
  return (
    <div class="space-y-3.5">
      <h4 class="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">ROW SETTINGS</h4>
      <div class="space-y-1.5"><label>Gap (Gutter)</label><select value={props.el.props.gap || 'normal'} onChange={(e) => props.handleChange('gap', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1"><option value="collapse">Sát nhau</option><option value="small">Nhỏ</option><option value="normal">Vừa</option><option value="large">Rộng</option></select></div>
      <div class="space-y-1.5"><label>Width</label><select value={props.el.props.width || ''} onChange={(e) => props.handleChange('width', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1"><option value="">Container</option><option value="full-width">Full width</option></select></div>
      <div class="space-y-1.5"><label>Vertical Align</label><select value={props.el.props.v_align || ''} onChange={(e) => props.handleChange('v_align', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1"><option value="">Top</option><option value="middle">Middle</option><option value="bottom">Bottom</option><option value="equal">Equal</option></select></div>
      <button onClick={() => props.onAddChildElement && props.onAddChildElement(props.el.id, 'col')} class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs cursor-pointer uppercase">+ Thêm Column</button>
    </div>
  );
}

function ColEditor(props: {el: UXElement; handleChange: (k: string, v: any) => void}) {
  return (
    <div class="space-y-3.5">
      <h4 class="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">COLUMN SETTINGS</h4>
      <div class="space-y-1.5">
        <label>Grid Span ({props.el.props.span || 12}/12)</label>
        <input type="range" min="1" max="12" step="1" value={props.el.props.span || 12} onInput={(e) => props.handleChange('span', parseInt(e.currentTarget.value))} class="w-full accent-blue-600 h-1 bg-gray-200 rounded-lg cursor-pointer" />
      </div>
      <div class="space-y-1.5"><label>Background Color</label><input type="text" value={props.el.props.bg_color || ''} onInput={(e) => props.handleChange('bg_color', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
      <div class="space-y-1.5"><label>Padding</label><input type="text" value={props.el.props.padding || '15px'} onInput={(e) => props.handleChange('padding', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
      <div class="space-y-1.5"><label>Text Align</label>
        <div class="flex bg-gray-50 rounded p-0.5 border border-gray-200">
          <button onClick={() => props.handleChange('text_align', 'left')} class={`flex-1 py-1 rounded text-center text-xs ${(props.el.props.text_align || 'left') === 'left' ? 'bg-white shadow-sm font-bold text-blue-600' : 'hover:bg-gray-100'}`}>L</button>
          <button onClick={() => props.handleChange('text_align', 'center')} class={`flex-1 py-1 rounded text-center text-xs ${props.el.props.text_align === 'center' ? 'bg-white shadow-sm font-bold text-blue-600' : 'hover:bg-gray-100'}`}>C</button>
          <button onClick={() => props.handleChange('text_align', 'right')} class={`flex-1 py-1 rounded text-center text-xs ${props.el.props.text_align === 'right' ? 'bg-white shadow-sm font-bold text-blue-600' : 'hover:bg-gray-100'}`}>R</button>
        </div>
      </div>
    </div>
  );
}

function TextEditor(props: {el: UXElement; handleChange: (k: string, v: any) => void}) {
  return (
    <div class="space-y-3.5">
      <h4 class="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">TEXT OPTIONS</h4>
      <div class="space-y-1.5">
        <label>Nội dung HTML</label>
        <textarea value={props.el.props.text || ''} onInput={(e) => props.handleChange('text', e.currentTarget.value)} rows={6} class="w-full bg-white border border-gray-250 rounded p-2 text-gray-800 text-[11px] font-mono" />
      </div>
    </div>
  );
}

function ImageEditor(props: {el: UXElement; handleChange: (k: string, v: any) => void}) {
  return (
    <div class="space-y-3.5">
      <h4 class="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">IMAGE OPTIONS</h4>
      <div class="space-y-1.5"><label>Image URL</label><input type="text" value={props.el.props.bg || ''} onInput={(e) => props.handleChange('bg', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
      <div class="space-y-1.5"><label>Hover Effect</label><select value={props.el.props.image_hover || 'zoom'} onChange={(e) => props.handleChange('image_hover', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1"><option value="none">None</option><option value="zoom">Zoom</option><option value="fade">Fade</option></select></div>
    </div>
  );
}

function ButtonEditor(props: {el: UXElement; handleChange: (k: string, v: any) => void}) {
  return (
    <div class="space-y-3.5">
      <h4 class="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">BUTTON CONFIGS</h4>
      <div class="space-y-1.5"><label>Text</label><input type="text" value={props.el.props.text || 'Button'} onInput={(e) => props.handleChange('text', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
      <div class="space-y-1.5"><label>Link</label><input type="text" value={props.el.props.link || '#'} onInput={(e) => props.handleChange('link', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
      <div class="space-y-1.5"><label>Color</label><select value={props.el.props.color || 'primary'} onChange={(e) => props.handleChange('color', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1"><option value="primary">Primary</option><option value="secondary">Secondary</option><option value="alert">Alert</option><option value="success">Success</option><option value="white">White</option></select></div>
      <div class="space-y-1.5"><label>Style</label><select value={props.el.props.style || ''} onChange={(e) => props.handleChange('style', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1"><option value="">Default</option><option value="outline">Outline</option><option value="link">Link</option><option value="underline">Underline</option></select></div>
      <div class="space-y-1.5"><label>Size</label><select value={props.el.props.size || 'normal'} onChange={(e) => props.handleChange('size', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1"><option value="small">Small</option><option value="normal">Normal</option><option value="medium">Medium</option><option value="large">Large</option></select></div>
    </div>
  );
}

function FeatureBoxEditor(props: {el: UXElement; handleChange: (k: string, v: any) => void}) {
  return (
    <div class="space-y-3.5">
      <h4 class="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">FEATURE BOX</h4>
      <div class="space-y-1.5"><label>Title</label><input type="text" value={props.el.props.title || ''} onInput={(e) => props.handleChange('title', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
      <div class="space-y-1.5"><label>Text</label><textarea value={props.el.props.text || ''} onInput={(e) => props.handleChange('text', e.currentTarget.value)} rows={3} class="w-full bg-white border border-gray-250 rounded p-2 text-[11px]" /></div>
      <div class="space-y-1.5"><label>Position</label><select value={props.el.props.pos || 'top'} onChange={(e) => props.handleChange('pos', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1"><option value="top">Top</option><option value="left">Left</option><option value="right">Right</option><option value="bottom">Bottom</option><option value="center">Center</option></select></div>
      <div class="space-y-1.5"><label>Icon Color</label><input type="text" value={props.el.props.icon_color || '#3b82f6'} onInput={(e) => props.handleChange('icon_color', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
    </div>
  );
}

function BannerEditor(props: {el: UXElement; colors: {name: string; value: string}[]; handleChange: (k: string, v: any) => void}) {
  return (
    <div class="space-y-3.5">
      <h4 class="font-bold text-[9px] tracking-widest text-blue-600 uppercase border-b border-gray-200 pb-1 font-mono">BANNER SETTINGS</h4>
      <div class="space-y-1.5"><label>Height</label><input type="text" value={props.el.props.height || '400px'} onInput={(e) => props.handleChange('height', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
      <div class="space-y-1.5"><label>Background Image</label><input type="text" value={props.el.props.bg || ''} onInput={(e) => props.handleChange('bg', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
      <div class="space-y-1.5"><label>Overlay Color</label><input type="text" value={props.el.props.bg_overlay || ''} onInput={(e) => props.handleChange('bg_overlay', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1" /></div>
      <div class="space-y-1.5"><label>Text Color</label><select value={props.el.props.text_color || 'light'} onChange={(e) => props.handleChange('text_color', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1"><option value="light">Light</option><option value="dark">Dark</option></select></div>
      <div class="space-y-1.5"><label>Hover Effect</label><select value={props.el.props.hover || 'zoom'} onChange={(e) => props.handleChange('hover', e.currentTarget.value)} class="w-full bg-white border border-gray-250 rounded px-2 py-1"><option value="none">None</option><option value="zoom">Zoom</option><option value="fade">Fade</option><option value="glow">Glow</option></select></div>
    </div>
  );
}
