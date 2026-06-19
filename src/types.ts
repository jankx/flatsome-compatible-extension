/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ElementType =
  | 'section'
  | 'row'
  | 'column'
  | 'text'
  | 'image'
  | 'button'
  | 'slider'
  | 'gallery'
  | 'video'
  | 'map'
  | 'gap'
  | 'divider'
  | 'icon';

export interface UXElement {
  id: string;
  type: ElementType;
  label: string;
  props: Record<string, any>;
  children: UXElement[];
}

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

export interface EditorState {
  elements: UXElement[];
  selectedId: string | null;
  viewMode: ViewMode;
  hoveredId: string | null;
  draggedElement: UXElement | null;
  dragOverId: string | null;
  dragPosition: 'before' | 'after' | 'inside' | null;
  history: UXElement[][];
  historyIndex: number;
}
