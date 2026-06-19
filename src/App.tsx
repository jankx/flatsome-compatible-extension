/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { UXElement, ElementType, ViewMode } from './types';
import {
  findElement,
  findElementWithParent,
  createElementTemplate,
  deepCloneElements,
  reassignIds,
  generateId,
  getDefaultLayout,
  convertToShortcodes,
  parseShortcodes,
} from './utils';

// Component layout imports
import Toolbar from './components/Toolbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Canvas from './components/Canvas';
import CodeExportDialog from './components/CodeExportDialog';

export default function App() {
  const [elements, setElements] = useState<UXElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activePreviewMode, setActivePreviewMode] = useState<boolean>(false);

  // Undo / Redo history state stack
  const [history, setHistory] = useState<UXElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Dialog export popups
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportType, setExportType] = useState<'shortcodes' | 'html'>('shortcodes');

  // Load starter database template on mount
  useEffect(() => {
    const defaultData = getDefaultLayout();
    setElements(defaultData);

    // Bootstrap history state
    setHistory([defaultData]);
    setHistoryIndex(0);

    // Register global exposed placeholders hooks so that WP plugins/backend scripts can inject logic
    (window as any).uxBuilderHook = {
      getCurrentLayout: () => elements,
      getCurrentShortcodes: () => convertToShortcodes(elements),
      loadLayout: (newElements: UXElement[]) => {
        setElements(newElements);
        setSelectedId(null);
        pushToHistory(newElements);
      },
      loadShortcodes: (shortcodeText: string) => {
        const parsed = parseShortcodes(shortcodeText);
        setElements(parsed);
        setSelectedId(null);
        pushToHistory(parsed);
      },
      onSave: (elementsData: UXElement[], shortcodeData: string) => {
        console.info('Backend hook triggered: onSave', { elementsData, shortcodeData });
        // Placeholders callback: Backend systems can bind custom callback here!
        if ((window as any).uxBuilderBackendSaveCallback) {
          (window as any).uxBuilderBackendSaveCallback(elementsData, shortcodeData);
        }
      },
    };
  }, []);

  // Sync saved layouts to hook listeners whenever modifications happen
  useEffect(() => {
    if (elements.length > 0) {
      const shortcodes = convertToShortcodes(elements);
      if ((window as any).uxBuilderHook?.onSave) {
        (window as any).uxBuilderHook.onSave(elements, shortcodes);
      }
    }
  }, [elements]);

  // Append new layout modification record to undo/redo timeline
  const pushToHistory = (newElements: UXElement[]) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(deepCloneElements(newElements));
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setElements(deepCloneElements(history[prevIdx]));
      setHistoryIndex(prevIdx);
      setSelectedId(null);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setElements(deepCloneElements(history[nextIdx]));
      setHistoryIndex(nextIdx);
      setSelectedId(null);
    }
  }, [history, historyIndex]);

  // Complete reset to starter sample
  const handleResetCanvas = () => {
    const confirmClear = window.confirm('Bạn có chắc chắn muốn xóa toàn bộ Canvas và reset về mẫu chuẩn Flatsome?');
    if (confirmClear) {
      const resetData = getDefaultLayout();
      setElements(resetData);
      setSelectedId(null);
      pushToHistory(resetData);
    }
  };

  // Add Element logic: places items beautifully depending on active hierarchy
  const handleAddElement = (type: ElementType) => {
    const newElement = createElementTemplate(type);
    const updatedElements = deepCloneElements(elements);

    // If an element is currently highlighted in settings
    if (selectedId) {
      const targetSearch = findElementWithParent(updatedElements, selectedId);
      if (targetSearch) {
        const { element: selectedElement, parent } = targetSearch;

        // Container Nodes: insert directly INSIDE its kids list!
        const isContainer = ['section', 'row', 'column', 'slider'].includes(selectedElement.type);
        if (isContainer) {
          if (!selectedElement.children) {
            selectedElement.children = [];
          }
          selectedElement.children.push(newElement);
        } else {
          // Leaf Nodes (text, button, divider): insert next to it (Symmetrical Placement)
          if (parent) {
            const idxOfSelected = parent.children.findIndex((c) => c.id === selectedId);
            parent.children.splice(idxOfSelected + 1, 0, newElement);
          } else {
            // Push directly to Root level next to top-level section page
            const idxOfRoot = updatedElements.findIndex((c) => c.id === selectedId);
            updatedElements.splice(idxOfRoot + 1, 0, newElement);
          }
        }
      }
    } else {
      // If no node is active, push the element straight to root level
      updatedElements.push(newElement);
    }

    setElements(updatedElements);
    setSelectedId(newElement.id);
    pushToHistory(updatedElements);
  };

  // Insert element directly at top-level index (between sections or at the end of sections)
  const handleInsertElement = (type: ElementType, index: number) => {
    const newElement = createElementTemplate(type);
    const updatedElements = deepCloneElements(elements);

    updatedElements.splice(index, 0, newElement);

    setElements(updatedElements);
    setSelectedId(newElement.id);
    pushToHistory(updatedElements);
  };

  // Add a child node directly underneath an existing container element (like sections or rows)
  const handleAddChildElement = (parentId: string, childType: ElementType) => {
    const newElement = createElementTemplate(childType);
    const updatedElements = deepCloneElements(elements);
    
    const target = findElement(updatedElements, parentId);
    if (target) {
      if (!target.children) {
        target.children = [];
      }
      
      // Automatic width column scaling for row children
      if (target.type === 'row' && childType === 'column') {
        const columnsCount = target.children.filter(c => c.type === 'column').length;
        let defaultSpan = 6;
        if (columnsCount === 0) defaultSpan = 12;
        else if (columnsCount === 1) {
          if (target.children[0]) target.children[0].props.span = 6;
          defaultSpan = 6;
        } else if (columnsCount === 2) {
          target.children.forEach(c => {
            if (c.type === 'column') c.props.span = 4;
          });
          defaultSpan = 4;
        } else {
          defaultSpan = 3;
        }
        newElement.props.span = defaultSpan;
      }

      target.children.push(newElement);
      setElements(updatedElements);
      setSelectedId(newElement.id);
      pushToHistory(updatedElements);
    }
  };

  // Delete Element Recurser
  const handleDeleteElement = (idToDelete: string) => {
    const updatedElements = deepCloneElements(elements);
    const search = findElementWithParent(updatedElements, idToDelete);

    if (search) {
      const { parent, index } = search;
      if (parent) {
        parent.children.splice(index, 1);
      } else {
        updatedElements.splice(index, 1);
      }

      if (selectedId === idToDelete) {
        setSelectedId(null);
      }

      setElements(updatedElements);
      pushToHistory(updatedElements);
    }
  };

  // Duplicate Element & re-assign unique subIDs automatically
  const handleDuplicateElement = (idToDuplicate: string) => {
    const updatedElements = deepCloneElements(elements);
    const search = findElementWithParent(updatedElements, idToDuplicate);

    if (search) {
      const { element, parent, index } = search;
      const duplicatedNode = reassignIds(JSON.parse(JSON.stringify(element)));
      duplicatedNode.label = `${element.label} (Copy)`;

      if (parent) {
        parent.children.splice(index + 1, 0, duplicatedNode);
      } else {
        updatedElements.splice(index + 1, 0, duplicatedNode);
      }

      setElements(updatedElements);
      setSelectedId(duplicatedNode.id);
      pushToHistory(updatedElements);
    }
  };

  // Inspector Options Merger
  const handleUpdateProps = (idToUpdate: string, newProps: Record<string, any>) => {
    const updatedElements = deepCloneElements(elements);
    const target = findElement(updatedElements, idToUpdate);

    if (target) {
      // if updating label
      if (newProps.label !== undefined) {
        target.label = newProps.label;
        delete newProps.label;
      }
      target.props = { ...target.props, ...newProps };
      setElements(updatedElements);
      pushToHistory(updatedElements);
    }
  };

  // Import parsed Shortcode texts
  const handleImportShortcodes = (textText: string) => {
    const parsedNodes = parseShortcodes(textText);
    setElements(parsedNodes);
    setSelectedId(null);
    pushToHistory(parsedNodes);
  };

  // Create clean display breadcrumbs path of current selection
  const getSelectedPath = (): string[] => {
    if (!selectedId) return [];
    const path: string[] = [];
    const updatedElements = deepCloneElements(elements);

    let currentId = selectedId;
    while (currentId) {
      const search = findElementWithParent(updatedElements, currentId);
      if (search) {
        path.unshift(`${search.element.label || search.element.type}`);
        currentId = search.parent ? search.parent.id : '';
      } else {
        break;
      }
    }
    return path;
  };

  // Build static custom HTML layout template compiled cleanly from elements tree
  const generateStaticHtmlCode = (): string => {
    const buildNodeHtml = (node: UXElement): string => {
      const customCls = node.props.class || '';

      switch (node.type) {
        case 'section': {
          const styleStr = `background-color: ${node.props.bg_color || 'transparent'}; ${
            node.props.bg_image ? `background-image: url('${node.props.bg_image}'); background-size: cover; background-position: center;` : ''
          } padding-top: ${node.props.padding_top || '60px'}; padding-bottom: ${node.props.padding_bottom || '60px'};`;

          const overlayDiv = node.props.overlay
            ? `<div class="absolute inset-0 z-0 pointer-events-none" style="background-color: ${node.props.overlay};"></div>`
            : '';

          const childrenHtml = node.children ? node.children.map(buildNodeHtml).join('\n') : '';

          return `<section style="${styleStr}" class="relative w-full ${customCls}">
  ${overlayDiv}
  <div class="relative z-10 w-full px-4 md:px-8 mx-auto">
    ${childrenHtml}
  </div>
</section>`;
        }

        case 'row': {
          const widthClass = node.props.width === 'full-width' ? 'max-w-full' : 'max-w-7xl mx-auto';
          const gutterGap = node.props.gutter === 'none' ? 'gap-0' : node.props.gutter === 'small' ? 'gap-4' : node.props.gutter === 'large' ? 'gap-8' : 'gap-6';
          const childrenHtml = node.children ? node.children.map(buildNodeHtml).join('\n') : '';

          return `<div class="grid grid-cols-12 w-full ${gutterGap} ${widthClass} ${customCls}">
  ${childrenHtml}
</div>`;
        }

        case 'column': {
          const span = node.props.span || 12;
          const alignText = node.props.text_align === 'center' ? 'text-center justify-center items-center' : node.props.text_align === 'right' ? 'text-right justify-end items-end' : 'text-left justify-start items-start';
          const colStyle = `background-color: ${node.props.bg_color || 'transparent'}; padding: ${node.props.padding || '15px'};`;
          const childrenHtml = node.children ? node.children.map(buildNodeHtml).join('\n') : '';

          return `<div style="${colStyle}" class="col-span-12 md:col-span-${span} flex flex-col justify-center rounded-lg ${alignText} ${customCls}">
  <div class="space-y-4 w-full">
    ${childrenHtml}
  </div>
</div>`;
        }

        case 'text':
          return `<div class="w-full prose max-w-none text-slate-800 leading-relaxed ${customCls}">
  ${node.props.text || ''}
</div>`;

        case 'image':
          const imgStyle = `width: ${node.props.width || '100%'}; height: ${node.props.height || 'auto'}; border-radius: ${node.props.radius || '0px'};`;
          return `<div class="flex flex-col justify-center items-center ${customCls}">
  <img src="${node.props.url}" alt="Flatsome image" style="${imgStyle}" class="object-cover transition-transform duration-300 block" fallback="no-referrer" />
</div>`;

        case 'button': {
          const sizeClass = node.props.size === 'small' ? 'px-3 py-1.5 text-xs' : node.props.size === 'large' ? 'px-7 py-3 text-base font-bold' : 'px-5 py-2.5 text-sm';
          const colorClass = node.props.color === 'secondary' ? 'bg-slate-700 hover:bg-slate-650 text-white' : node.props.color === 'success' ? 'bg-emerald-600 hover:bg-emerald-555 text-white' : node.props.color === 'alert' ? 'bg-rose-600 hover:bg-rose-555 text-white' : 'bg-blue-600 hover:bg-blue-555 text-white';
          const borderClass = node.props.style === 'outline' ? 'bg-transparent border-2 border-current text-current' : node.props.style === 'round' ? 'rounded-full' : 'rounded';

          return `<div class="w-full flex justify-center items-center ${customCls}">
  <a href="${node.props.link || '#'}" class="inline-block font-sans font-semibold text-center transition-all duration-200 ${sizeClass} ${colorClass} ${borderClass}">
    ${node.props.text || 'Explore'}
  </a>
</div>`;
        }

        case 'slider': {
          const childrenHtml = node.children ? node.children.map(buildNodeHtml).join('\n') : '';
          return `<div class="relative w-full overflow-hidden shadow-lg border border-slate-200/50 rounded-2xl ${customCls}" style="min-height: ${node.props.height || '380px'}">
  <div class="relative w-full h-full">
    ${childrenHtml}
  </div>
</div>`;
        }

        case 'gallery': {
          const cols = node.props.columns || 3;
          let imageGridHtml = '';
          (node.props.images || []).forEach((img: string) => {
            imageGridHtml += `<div class="relative group overflow-hidden rounded-lg shadow-sm border border-slate-100">
  <img src="${img}" class="w-full h-44 object-cover transform hover:scale-105 transition-transform duration-300" />
</div>`;
          });

          return `<div class="w-full grid grid-cols-2 md:grid-cols-${cols} gap-4 ${customCls}">
  ${imageGridHtml}
</div>`;
        }

        case 'video':
          return `<div class="w-full relative shadow-lg rounded-xl overflow-hidden aspect-video ${customCls}">
  <iframe src="${node.props.url}" class="w-full h-full object-cover rounded-xl" frameborder="0"></iframe>
</div>`;

        case 'map':
          return `<div class="w-full rounded-xl overflow-hidden shadow ${customCls}" style="height: ${node.props.height || '350px'}">
  <iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${encodeURIComponent(node.props.address || '')}&z=${node.props.zoom || 14}&output=embed"></iframe>
</div>`;

        case 'gap':
          return `<div style="height: ${node.props.height || '30px'}" class="w-full ${customCls}"></div>`;

        case 'divider':
          const hrStyle = `border-top-width: ${node.props.thickness || '3px'}; border-top-color: ${node.props.color || '#cbd5e1'}; width: ${node.props.width || '100px'}; margin: 0 auto;`;
          return `<div class="w-full flex justify-center items-center ${customCls}">
  <hr style="${hrStyle}" class="border-t border-solid transition-all" />
</div>`;

        case 'icon': {
          return `<div class="w-full flex justify-center items-center ${customCls}">
  <span style="font-size: ${node.props.size || '36px'}; color: ${node.props.color || '#3b82f6'};">★</span>
</div>`;
        }

        default:
          return `<!-- Element ${node.type} -->`;
      }
    };

    const coreHtml = elements.map(buildNodeHtml).join('\n\n');

    // Return encapsulated beautiful copyable full template
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flatsome UX Builder static HTML</title>
  <!-- Tailwind CSS Play CDN compatibility layers -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background-color: #f8fafc; }
  </style>
</head>
<body class="antialiased text-slate-800">

  <!-- ================= START DESIGNED FLATSOME SUITE ================= -->
  <div id="designed-flatsome-export">
${coreHtml.split('\n').map(line => '    ' + line).join('\n')}
  </div>
  <!-- ================== END DESIGNED FLATSOME SUITE ================== -->

</body>
</html>`;
  };

  const handleOpenExport = (t: 'shortcodes' | 'html') => {
    setExportType(t);
    setIsExportOpen(true);
  };

  const activeSelectedElementNode = selectedId ? findElement(elements, selectedId) : null;

  return (
    <div id="app-root-builder" className="h-screen flex flex-col overflow-hidden bg-[#f1f3f5]">
      {/* Dynamic top controls bar */}
      <Toolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleResetCanvas}
        onOpenExport={handleOpenExport}
        selectedPath={getSelectedPath()}
        activePreviewMode={activePreviewMode}
        setActivePreviewMode={setActivePreviewMode}
      />

      {/* Main Workspace Frame */}
      <div id="workspace-layout-split" className="flex-1 flex overflow-hidden">
        {/* Left components shelf catalog & Navigator Element Tree */}
        <LeftSidebar
          onAddElement={handleAddElement}
          elements={elements}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
        />

        {/* Center Live Sandbox Drag canvas */}
        <Canvas
          elements={elements}
          viewMode={viewMode}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          activePreviewMode={activePreviewMode}
          onUpdateProps={handleUpdateProps}
          onAddElement={handleAddElement}
          onInsertElement={handleInsertElement}
          onAddChildElement={handleAddChildElement}
          onLoadMock={() => {
            const starter = getDefaultLayout();
            setElements(starter);
            pushToHistory(starter);
          }}
        />

        {/* Right Property values Settings Inspector */}
        <RightSidebar
          selectedElement={activeSelectedElementNode}
          onUpdateProps={handleUpdateProps}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          onAddChildElement={handleAddChildElement}
        />
      </div>

      {/* Code Export/Import interactive Dialog modal */}
      <CodeExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        type={exportType}
        codeContent={exportType === 'shortcodes' ? convertToShortcodes(elements) : generateStaticHtmlCode()}
        onImportShortcodes={handleImportShortcodes}
      />
    </div>
  );
}
