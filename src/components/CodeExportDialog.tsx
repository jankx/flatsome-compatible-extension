import {createSignal, createEffect, Show} from 'solid-js';

export default function CodeExportDialog(props: {
  isOpen: boolean;
  onClose: () => void;
  type: 'shortcodes' | 'html';
  codeContent: string;
  onImportShortcodes: (text: string) => void;
}) {
  const [copied, setCopied] = createSignal(false);
  const [inputText, setInputText] = createSignal('');
  const [importStatus, setImportStatus] = createSignal<'idle' | 'success' | 'error'>('idle');

  createEffect(() => {
    if (props.isOpen) {
      setCopied(false);
      setInputText('');
      setImportStatus('idle');
    }
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleImport = () => {
    if (!inputText().trim()) {
      setImportStatus('error');
      return;
    }
    try {
      props.onImportShortcodes(inputText());
      setImportStatus('success');
      setTimeout(() => props.onClose(), 500);
    } catch {
      setImportStatus('error');
    }
  };

  const isShortcode = () => props.type === 'shortcodes';

  return (
    <Show when={props.isOpen}>
      <div id="export-dialog-overlay" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none">
        <div id="export-dialog-container" class="bg-[#161d2d] border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl text-slate-200 font-sans flex flex-col" style={{'max-height': '85vh'}}>
          <div class="p-4 bg-[#1a2332] border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold uppercase tracking-wider">{isShortcode() ? 'Shortcode Flatsome' : 'Static HTML Export'}</h3>
              <p class="text-[10px] text-slate-400">{isShortcode() ? 'Sao chép hoặc dán shortcode Flatsome' : 'HTML thuần Tailwind'}</p>
            </div>
            <button onClick={props.onClose} class="p-1 px-2 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div class="p-5 flex-1 overflow-y-auto space-y-4 custom-scrollbar select-text">
            <Show when={isShortcode()}>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2 flex flex-col">
                  <span class="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">SAO CHÉP (EXPORT):</span>
                  <div class="relative flex-1 bg-[#0a0f18] rounded-xl p-3 border border-slate-900 min-h-[180px]">
                    <pre class="text-[10px] font-mono text-emerald-400 overflow-auto max-h-52 custom-scrollbar whitespace-pre-wrap select-all">{props.codeContent}</pre>
                    <button onClick={handleCopy} class="absolute right-3 top-3 p-1.5 bg-[#161d2d] hover:bg-blue-600 hover:text-white text-slate-400 rounded transition-all">
                      <Show when={copied()} fallback={<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="8" height="4" x="10" y="2" rx="1"/><path d="M16 7h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"/></svg>}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
                      </Show>
                    </button>
                  </div>
                </div>
                <div class="space-y-2 flex flex-col">
                  <span class="text-[10px] uppercase font-mono font-bold tracking-wider text-blue-400">DÁN SHORTCODE (IMPORT):</span>
                  <textarea value={inputText()} onInput={(e) => setInputText(e.currentTarget.value)} rows={8} placeholder="[section] [row] [col] ... [/col] [/row] [/section]" class="w-full h-full bg-[#0a0f18] border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-sky-300 focus:outline-none focus:border-blue-500 resize-none placeholder-slate-600" />
                  <button onClick={handleImport} class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-3 text-xs rounded-lg transition-colors">NHẬP VÀO CANVAS</button>
                  <Show when={importStatus() === 'success'}><span class="text-[10px] text-emerald-400 mt-2 block text-center">✓ Thành công!</span></Show>
                  <Show when={importStatus() === 'error'}><span class="text-[10px] text-red-400 mt-2 block text-center">⚠ Mã không hợp lệ</span></Show>
                </div>
              </div>
            </Show>
            <Show when={!isShortcode()}>
              <div class="space-y-3">
                <span class="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">STATIC HTML:</span>
                <div class="relative bg-[#0a0f18] rounded-xl p-3 border border-slate-900 min-h-[220px]">
                  <pre class="text-[10px] font-mono text-sky-350 overflow-auto max-h-72 custom-scrollbar whitespace-pre leading-normal">{props.codeContent}</pre>
                  <button onClick={handleCopy} class="absolute right-3 top-3 p-1.5 bg-[#161d2d] hover:bg-blue-600 hover:text-white text-slate-400 rounded transition-all">
                    <Show when={copied()} fallback={<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="8" height="4" x="10" y="2" rx="1"/><path d="M16 7h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"/></svg>}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
                    </Show>
                  </button>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
}
