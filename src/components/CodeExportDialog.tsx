/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Code,
  Download,
  AlertTriangle,
  FileText,
  Import,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface CodeExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'shortcodes' | 'html';
  codeContent: string;
  onImportShortcodes: (text: string) => void;
}

export default function CodeExportDialog({
  isOpen,
  onClose,
  type,
  codeContent,
  onImportShortcodes,
}: CodeExportDialogProps) {
  const [copied, setCopied] = useState(false);
  const [inputText, setInputText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      setInputText('');
      setImportStatus('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    if (!inputText.trim()) {
      setImportStatus('error');
      return;
    }
    try {
      onImportShortcodes(inputText);
      setImportStatus('success');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (e) {
      setImportStatus('error');
    }
  };

  const isShortcode = type === 'shortcodes';

  return (
    <div
      id="export-dialog-overlay"
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-fade-in"
    >
      <div
        id="export-dialog-container"
        className="bg-[#161d2d] border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-200 font-sans flex flex-col"
        style={{ maxHeight: '85vh' }}
      >
        {/* Header toolbar */}
        <div className="p-4 bg-[#1a2332] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              {isShortcode ? <FileText size={18} /> : <Code size={18} />}
            </span>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider">
                {isShortcode ? 'Shortcode Flatsome (Import / Export)' : 'Static Layout HTML Export'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {isShortcode
                  ? 'Sao chép mã để dán trực tiếp vào WordPress Flatsome, hoặc dán mã vào để sửa đổi.'
                  : 'HTML thuần tối ưu hóa Bootstrap/Tailwind để nhúng vào mã nguồn backend tùy chọn.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Dynamic code scroll box content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 custom-scrollbar select-text">
          {/* Expose action details for imports */}
          {isShortcode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Copy Export Column */}
              <div className="space-y-2 flex flex-col">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 block">
                  📥 SAO CHÉP MÃ LÝ TRÌNH (EXPORT):
                </span>
                <div className="relative flex-1 bg-[#0a0f18] rounded-xl p-3 border border-slate-900 group min-h-[180px]">
                  <pre className="text-[10px] font-mono text-emerald-400 overflow-auto max-h-52 custom-scrollbar whitespace-pre-wrap select-all">
                    {codeContent}
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute right-3 top-3 p-1.5 bg-[#161d2d] hover:bg-blue-600 hover:text-white text-slate-400 rounded transition-all shadow-md"
                    title="Click to copy codes"
                  >
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              {/* Paste Import Column */}
              <div className="space-y-2 flex flex-col">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#38bdf8] block">
                  📤 DÁN SHORTCODE FLATSOME (IMPORT):
                </span>
                <div className="flex-1 flex flex-col">
                  <textarea
                    rows={8}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="[section bg_color='#0f172a'] [row] [col span='12'] ... [/col] [/row] [/section]"
                    className="w-full h-full bg-[#0a0f18] border border-slate-800 group rounded-xl p-3 text-[10px] font-mono text-sky-305 focus:outline-none focus:border-blue-500 custom-scrollbar resize-none placeholder-slate-600"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={handleImport}
                      className="w-full bg-[#2b82f6] hover:bg-blue-500 text-white font-semibold py-2 px-3 text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Import size={12} />
                      <span>NHẬP CẤU TRÚC VÀO CANVAS</span>
                    </button>
                  </div>

                  {importStatus === 'success' && (
                    <span className="text-[10px] text-emerald-400 mt-2 bg-emerald-950/40 p-2 border border-emerald-900/50 rounded block font-medium text-center">
                      ✓ Nạp cấu trúc Flatsome thành công! Canvas đang hiển thị.
                    </span>
                  )}
                  {importStatus === 'error' && (
                    <span className="text-[10px] text-red-400 mt-2 bg-red-950/40 p-2 border border-red-900/50 rounded block font-medium text-center">
                      ⚠ Mã không hợp lệ. Vui lòng kiểm tra kỹ đóng mở ngoặc [] theo chuẩn WP.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {!isShortcode && (
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 block">
                STATIC TAILWIND DESIGN LAYOUT:
              </span>
              <div className="relative bg-[#0a0f18] rounded-xl p-3 border border-slate-900 min-h-[220px]">
                <pre className="text-[10px] font-mono text-sky-350 overflow-auto max-h-72 custom-scrollbar whitespace-pre select-all leading-normal">
                  {codeContent}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute right-3 top-3 p-1.5 bg-[#161d2d] hover:bg-blue-600 hover:text-white text-slate-400 rounded transition-all shadow-md"
                  title="Click to copy codes"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
              </div>

              {/* Developer integration guidelines */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                <div className="flex items-center space-x-1 text-amber-450 font-bold text-xs">
                  <AlertTriangle size={13} />
                  <span>HƯỚNG DẪN TIÊM LOGICS (BACKEND INJECTION):</span>
                </div>
                <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">
                  Để nạp dữ liệu động từ database hoặc PHP/NodeJS backend:
                  Hãy tìm các chuỗi HTML hiển thị dữ liệu hoặc link liên kết, rồi thay thế bằng các câu lệnh động, chẳng hạn như dán code WordPress PHP:{' '}
                  <code className="text-amber-300 font-mono text-[10px]">
                    &lt;?php echo get_theme_mod(&apos;custom_logo&apos;); ?&gt;
                  </code>{' '}
                  hoặc các template engines (Blade, Smarty, Handlebars, v.v.).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bounds */}
        <div className="p-3 bg-[#131a26] border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono tracking-wide">
          <span>FLATSOME PORTABLE SUITE v1.0.0 — READY TO DEPLOY</span>
        </div>
      </div>
    </div>
  );
}
