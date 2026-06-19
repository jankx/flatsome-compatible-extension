export type ElementType =
  | 'section'
  | 'row'
  | 'row_inner'
  | 'col'
  | 'col_inner'
  | 'ux_banner'
  | 'text_box'
  | 'text'
  | 'ux_text'
  | 'title'
  | 'ux_image'
  | 'button'
  | 'featured_box'
  | 'ux_slider'
  | 'ux_gallery'
  | 'ux_video'
  | 'map'
  | 'gap'
  | 'divider'
  | 'scroll_to'
  | 'accordion'
  | 'accordion-item'
  | 'tabgroup'
  | 'tab'
  | 'block'
  | 'message_box'
  | 'ux_countdown'
  | 'share'
  | 'follow'
  | 'search'
  | 'ux_logo'
  | 'ux_image_box';

export interface UXElement {
  id: string;
  type: ElementType;
  label: string;
  props: Record<string, any>;
  children: UXElement[];
}

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

export const FLATSOME_SELF_CLOSING: ElementType[] = [
  'gap', 'divider', 'ux_image', 'button', 'map', 'ux_video',
  'scroll_to', 'block', 'share', 'follow', 'search', 'ux_logo',
  'ux_countdown', 'message_box', 'ux_image_box', 'title',
];

export const FLATSOME_CONTAINERS: ElementType[] = [
  'section', 'row', 'row_inner', 'col', 'col_inner',
  'ux_banner', 'text_box', 'text', 'ux_text',
  'ux_slider', 'ux_gallery', 'accordion', 'accordion-item',
  'tabgroup', 'tab', 'featured_box',
];

export const ELEMENT_CATEGORIES: Record<string, { label: string; types: ElementType[] }> = {
  layout: {
    label: 'Layout',
    types: ['section', 'row', 'row_inner', 'col', 'col_inner', 'block', 'gap', 'divider', 'scroll_to'],
  },
  content: {
    label: 'Content',
    types: ['text', 'ux_text', 'title', 'ux_image', 'ux_image_box', 'ux_gallery', 'ux_video', 'map', 'ux_logo', 'message_box', 'search'],
  },
  banners: {
    label: 'Banners & Sliders',
    types: ['ux_banner', 'text_box', 'ux_slider', 'featured_box'],
  },
  interactive: {
    label: 'Interactive',
    types: ['accordion', 'accordion-item', 'tabgroup', 'tab', 'ux_countdown', 'button', 'share', 'follow', 'scroll_to'],
  },
};
