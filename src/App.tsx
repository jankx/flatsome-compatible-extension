import {createSignal, createEffect, onMount} from 'solid-js';
import {UXElement, ElementType, ViewMode} from './types';
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

import Toolbar from './components/Toolbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Canvas from './components/Canvas';
import CodeExportDialog from './components/CodeExportDialog';

export default function App() {
  const [elements, setElements] = createSignal<UXElement[]>([]);
  const [selectedId, setSelectedId] = createSignal<string | null>(null);
  const [viewMode, setViewMode] = createSignal<ViewMode>('desktop');
  const [hoveredId, setHoveredId] = createSignal<string | null>(null);
  const [activePreviewMode, setActivePreviewMode] = createSignal<boolean>(false);
  const [history, setHistory] = createSignal<UXElement[][]>([]);
  const [historyIndex, setHistoryIndex] = createSignal<number>(-1);
  const [isExportOpen, setIsExportOpen] = createSignal(false);
  const [exportType, setExportType] = createSignal<'shortcodes' | 'html'>('shortcodes');

  onMount(() => {
    const defaultData = getDefaultLayout();
    setElements(defaultData);
    setHistory([defaultData]);
    setHistoryIndex(0);

    (window as any).uxBuilderHook = {
      getCurrentLayout: () => elements(),
      getCurrentShortcodes: () => convertToShortcodes(elements()),
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
        if ((window as any).uxBuilderBackendSaveCallback) {
          (window as any).uxBuilderBackendSaveCallback(elementsData, shortcodeData);
        }
      },
    };
  });

  createEffect(() => {
    const els = elements();
    if (els.length > 0) {
      const shortcodes = convertToShortcodes(els);
      if ((window as any).uxBuilderHook?.onSave) {
        (window as any).uxBuilderHook.onSave(els, shortcodes);
      }
    }
  });

  const pushToHistory = (newElements: UXElement[]) => {
    const prev = history();
    const idx = historyIndex();
    const nextHistory = prev.slice(0, idx + 1);
    nextHistory.push(deepCloneElements(newElements));
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = () => {
    const idx = historyIndex();
    if (idx > 0) {
      const hist = history();
      const prevIdx = idx - 1;
      setElements(deepCloneElements(hist[prevIdx]));
      setHistoryIndex(prevIdx);
      setSelectedId(null);
    }
  };

  const handleRedo = () => {
    const hist = history();
    const idx = historyIndex();
    if (idx < hist.length - 1) {
      const nextIdx = idx + 1;
      setElements(deepCloneElements(hist[nextIdx]));
      setHistoryIndex(nextIdx);
      setSelectedId(null);
    }
  };

  const handleResetCanvas = () => {
    const confirmClear = window.confirm('Bạn có chắc chắn muốn xóa toàn bộ Canvas và reset về mẫu chuẩn Flatsome?');
    if (confirmClear) {
      const resetData = getDefaultLayout();
      setElements(resetData);
      setSelectedId(null);
      pushToHistory(resetData);
    }
  };

  const handleAddElement = (type: ElementType) => {
    const newElement = createElementTemplate(type);
    const currentElements = elements();
    const updatedElements = deepCloneElements(currentElements);

    const selId = selectedId();
    if (selId) {
      const targetSearch = findElementWithParent(updatedElements, selId);
      if (targetSearch) {
        const {element: selectedElement, parent} = targetSearch;
        const isContainer = ['section', 'row', 'row_inner', 'col', 'col_inner', 'ux_banner', 'text_box', 'ux_slider', 'accordion', 'tabgroup'].includes(selectedElement.type);
        if (isContainer) {
          if (!selectedElement.children) selectedElement.children = [];
          selectedElement.children.push(newElement);
        } else {
          if (parent) {
            const idxOfSelected = parent.children.findIndex((c) => c.id === selId);
            parent.children.splice(idxOfSelected + 1, 0, newElement);
          } else {
            const idxOfRoot = updatedElements.findIndex((c) => c.id === selId);
            updatedElements.splice(idxOfRoot + 1, 0, newElement);
          }
        }
      }
    } else {
      updatedElements.push(newElement);
    }

    setElements(updatedElements);
    setSelectedId(newElement.id);
    pushToHistory(updatedElements);
  };

  const handleInsertElement = (type: ElementType, index: number) => {
    const newElement = createElementTemplate(type);
    const updatedElements = deepCloneElements(elements());
    updatedElements.splice(index, 0, newElement);
    setElements(updatedElements);
    setSelectedId(newElement.id);
    pushToHistory(updatedElements);
  };

  const handleAddChildElement = (parentId: string, childType: ElementType) => {
    const newElement = createElementTemplate(childType);
    const updatedElements = deepCloneElements(elements());

    const target = findElement(updatedElements, parentId);
    if (target) {
      if (!target.children) target.children = [];

      if (target.type === 'row' && childType === 'col') {
        const columnsCount = target.children.filter((c) => c.type === 'col').length;
        let defaultSpan = 6;
        if (columnsCount === 0) defaultSpan = 12;
        else if (columnsCount === 1) {
          if (target.children[0]) target.children[0].props.span = 6;
          defaultSpan = 6;
        } else if (columnsCount === 2) {
          target.children.forEach((c) => { if (c.type === 'col') c.props.span = 4; });
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

  const handleDeleteElement = (idToDelete: string) => {
    const updatedElements = deepCloneElements(elements());
    const search = findElementWithParent(updatedElements, idToDelete);

    if (search) {
      const {parent, index} = search;
      if (parent) {
        parent.children.splice(index, 1);
      } else {
        updatedElements.splice(index, 1);
      }
      if (selectedId() === idToDelete) setSelectedId(null);
      setElements(updatedElements);
      pushToHistory(updatedElements);
    }
  };

  const handleDuplicateElement = (idToDuplicate: string) => {
    const updatedElements = deepCloneElements(elements());
    const search = findElementWithParent(updatedElements, idToDuplicate);

    if (search) {
      const {element, parent, index} = search;
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

  const handleUpdateProps = (idToUpdate: string, newProps: Record<string, any>) => {
    const updatedElements = deepCloneElements(elements());
    const target = findElement(updatedElements, idToUpdate);

    if (target) {
      if (newProps.label !== undefined) {
        target.label = newProps.label;
        delete newProps.label;
      }
      target.props = {...target.props, ...newProps};
      setElements(updatedElements);
      pushToHistory(updatedElements);
    }
  };

  const handleImportShortcodes = (textText: string) => {
    const parsedNodes = parseShortcodes(textText);
    setElements(parsedNodes);
    setSelectedId(null);
    pushToHistory(parsedNodes);
  };

  const getSelectedPath = (): string[] => {
    const selId = selectedId();
    if (!selId) return [];
    const path: string[] = [];
    const cloned = deepCloneElements(elements());
    let currentId = selId;
    while (currentId) {
      const search = findElementWithParent(cloned, currentId);
      if (search) {
        path.unshift(`${search.element.label || search.element.type}`);
        currentId = search.parent ? search.parent.id : '';
      } else {
        break;
      }
    }
    return path;
  };

  const generateStaticHtmlCode = (): string => {
    const buildNodeHtml = (node: UXElement): string => {
      const customCls = node.props.class || '';
      switch (node.type) {
        case 'section': {
          const styleStr = `background-color: ${node.props.bg_color || 'transparent'}; ${node.props.bg ? `background-image: url('${node.props.bg}'); background-size: cover; background-position: center;` : ''} padding: ${node.props.padding || '60px 0px'};`;
          const overlayDiv = node.props.bg_overlay ? `<div class="absolute inset-0 z-0" style="background-color: ${node.props.bg_overlay};"></div>` : '';
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
          const childrenHtml = node.children ? node.children.map(buildNodeHtml).join('\n') : '';
          return `<div class="grid grid-cols-12 w-full gap-4 ${widthClass} ${customCls}">
  ${childrenHtml}
</div>`;
        }
        case 'col':
        case 'col_inner': {
          const span = node.props.span || 12;
          const colStyle = `background-color: ${node.props.bg_color || 'transparent'}; padding: ${node.props.padding || '15px'};`;
          const childrenHtml = node.children ? node.children.map(buildNodeHtml).join('\n') : '';
          return `<div style="${colStyle}" class="col-span-12 md:col-span-${span} ${customCls}">
  ${childrenHtml || '<div class="p-4 text-center text-slate-400">Empty column</div>'}
</div>`;
        }
        case 'text':
        case 'ux_text':
          return `<div class="prose max-w-none ${customCls}">${node.props.text || ''}</div>`;
        case 'ux_image':
          return `<div class="${customCls}"><img src="${node.props.bg || ''}" alt="" style="width:100%;height:auto" /></div>`;
        case 'button': {
          const sizeClass = node.props.size === 'small' ? 'px-3 py-1.5 text-xs' : node.props.size === 'large' || node.props.size === 'xlarge' ? 'px-7 py-3 text-base' : 'px-5 py-2.5 text-sm';
          return `<div class="${customCls}"><a href="${node.props.link || '#'}" class="inline-block font-semibold text-center rounded ${sizeClass}">${node.props.text || 'Button'}</a></div>`;
        }
        case 'featured_box':
          return `<div class="${customCls}"><h4>${node.props.title || ''}</h4><p>${node.props.text || ''}</p></div>`;
        case 'gap':
          return `<div style="height: ${node.props.height || '30px'}" class="w-full ${customCls}"></div>`;
        case 'divider':
          return `<div class="w-full flex justify-center ${customCls}"><hr style="width: ${node.props.width || '100px'}; border-top-width: ${node.props.thickness || '3px'}; border-top-color: ${node.props.color || '#cbd5e1'};" /></div>`;
        case 'ux_banner': {
          const bgStyle = `background-color: ${node.props.bg_color || 'transparent'}; ${node.props.bg ? `background-image: url('${node.props.bg}');` : ''} background-size: cover; background-position: center; height: ${node.props.height || '400px'};`;
          const childrenHtml = node.children ? node.children.map(buildNodeHtml).join('\n') : '';
          return `<div style="${bgStyle}" class="relative flex items-center justify-center ${customCls}">${node.props.bg_overlay ? `<div class="absolute inset-0" style="background-color: ${node.props.bg_overlay};"></div>` : ''}<div class="relative z-10">${childrenHtml}</div></div>`;
        }
        case 'text_box':
          return `<div class="${customCls}">${node.children ? node.children.map(buildNodeHtml).join('\n') : ''}</div>`;
        case 'title':
          return `<h2 class="${customCls}">${node.props.text || ''}</h2>`;
        case 'ux_slider':
          return `<div class="${customCls}">${node.children ? node.children.map(buildNodeHtml).join('\n') : ''}</div>`;
        case 'ux_gallery':
          return `<div class="${customCls}">Gallery</div>`;
        case 'ux_video':
          return `<div class="${customCls}"><iframe src="${node.props.url}" frameborder="0" class="w-full aspect-video"></iframe></div>`;
        case 'map':
          return `<div class="${customCls}" style="height:${node.props.height || '350px'}"><iframe width="100%" height="100%" src="https://maps.google.com/maps?q=${encodeURIComponent(node.props.address || '')}&z=${node.props.zoom || 14}&output=embed"></iframe></div>`;
        case 'accordion':
          return `<div class="${customCls}">${node.children ? node.children.map(buildNodeHtml).join('\n') : ''}</div>`;
        case 'accordion-item':
          return `<details><summary>${node.props.title || ''}</summary>${node.children ? node.children.map(buildNodeHtml).join('\n') : ''}</details>`;
        case 'tabgroup':
          return `<div class="${customCls}">${node.children ? node.children.map(buildNodeHtml).join('\n') : ''}</div>`;
        case 'tab':
          return `<div>${node.props.title || ''}: ${node.children ? node.children.map(buildNodeHtml).join('\n') : ''}</div>`;
        case 'scroll_to':
          return `<div id="${node.props.title || ''}" class="${customCls}"></div>`;
        case 'block':
          return `<!-- Block: ${node.props.id || ''} -->`;
        case 'message_box':
          return `<div style="background:${node.props.bg_color || '#f0f9ff'}" class="p-4 rounded ${customCls}">${node.children ? node.children.map(buildNodeHtml).join('\n') : ''}</div>`;
        case 'ux_countdown':
          return `<div class="${customCls}">Countdown: ${node.props.date || ''}</div>`;
        case 'share':
          return `<div class="${customCls}">Share Icons</div>`;
        case 'follow':
          return `<div class="${customCls}">Follow Icons</div>`;
        case 'search':
          return `<div class="${customCls}"><input type="search" placeholder="Search..." /></div>`;
        case 'ux_logo':
          return `<div class="${customCls}">Logo</div>`;
        case 'ux_image_box':
          return `<div class="${customCls}"><h4>${node.props.title || ''}</h4><p>${node.props.text || ''}</p></div>`;
        default:
          return `<!-- ${node.type} -->`;
      }
    };

    const coreHtml = elements().map(buildNodeHtml).join('\n\n');
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flatsome UX Builder Export</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="antialiased text-slate-800">
  <div id="flatsome-export">
${coreHtml.split('\n').map((line) => '    ' + line).join('\n')}
  </div>
</body>
</html>`;
  };

  const handleOpenExport = (t: 'shortcodes' | 'html') => {
    setExportType(t);
    setIsExportOpen(true);
  };

  const activeSelectedElementNode = () => {
    const id = selectedId();
    if (!id) return null;
    return findElement(elements(), id);
  };

  return (
    <div id="app-root-builder" class="h-screen flex flex-col overflow-hidden bg-[#f1f3f5]">
      <Toolbar
        viewMode={viewMode()}
        setViewMode={setViewMode}
        canUndo={historyIndex() > 0}
        canRedo={historyIndex() < history().length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleResetCanvas}
        onOpenExport={handleOpenExport}
        selectedPath={getSelectedPath()}
        activePreviewMode={activePreviewMode()}
        setActivePreviewMode={setActivePreviewMode}
      />

      <div id="workspace-layout-split" class="flex-1 flex overflow-hidden">
        <LeftSidebar
          onAddElement={handleAddElement}
          elements={elements()}
          selectedId={selectedId()}
          setSelectedId={setSelectedId}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
        />

        <Canvas
          elements={elements()}
          viewMode={viewMode()}
          selectedId={selectedId()}
          setSelectedId={setSelectedId}
          hoveredId={hoveredId()}
          setHoveredId={setHoveredId}
          activePreviewMode={activePreviewMode()}
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

        <RightSidebar
          selectedElement={activeSelectedElementNode()}
          onUpdateProps={handleUpdateProps}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          onAddChildElement={handleAddChildElement}
        />
      </div>

      <CodeExportDialog
        isOpen={isExportOpen()}
        onClose={() => setIsExportOpen(false)}
        type={exportType()}
        codeContent={exportType() === 'shortcodes' ? convertToShortcodes(elements()) : generateStaticHtmlCode()}
        onImportShortcodes={handleImportShortcodes}
      />
    </div>
  );
}
