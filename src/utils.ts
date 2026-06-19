/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UXElement, ElementType } from './types';

// Generate a clean solid ID
export function generateId(): string {
  return `${Math.random().toString(36).substring(2, 9)}`;
}

// Deeply clonse UXElement array
export function deepCloneElements(elements: UXElement[]): UXElement[] {
  return JSON.parse(JSON.stringify(elements));
}

// Find item and its parent
export function findElementWithParent(
  elements: UXElement[],
  id: string,
  parent: UXElement | null = null
): { element: UXElement; parent: UXElement | null; index: number } | null {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].id === id) {
      return { element: elements[i], parent, index: i };
    }
    if (elements[i].children && elements[i].children.length > 0) {
      const result = findElementWithParent(elements[i].children, id, elements[i]);
      if (result) return result;
    }
  }
  return null;
}

// Find only item
export function findElement(elements: UXElement[], id: string): UXElement | null {
  const result = findElementWithParent(elements, id);
  return result ? result.element : null;
}

// Create new element with default properties
export function createElementTemplate(type: ElementType): UXElement {
  const id = generateId();
  switch (type) {
    case 'section':
      return {
        id,
        type,
        label: 'Section',
        props: {
          bg_color: '#f8fafc',
          bg_image: '',
          padding_top: '60px',
          padding_bottom: '60px',
          overlay: 'rgba(0,0,0,0)',
          border_width: '0px',
          border_color: '#cbd5e1',
          class: '',
        },
        children: [
          {
            id: generateId(),
            type: 'row',
            label: 'Row',
            props: {
              gutter: 'medium', // small, medium, large, collapse
              width: 'container', // container, full-width
              class: '',
            },
            children: [
              {
                id: generateId(),
                type: 'column',
                label: 'Column',
                props: {
                  span: 6,
                  bg_color: '',
                  padding: '20px',
                  text_align: 'left',
                  animation: 'none',
                  class: '',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'text',
                    label: 'Text',
                    props: {
                      text: '<h2>Create Stunning Designs</h2><p>Double click here to customize these texts instantly. UX Builder gives you total design superpowers.</p>',
                      class: '',
                    },
                    children: [],
                  },
                ],
              },
              {
                id: generateId(),
                type: 'column',
                label: 'Column',
                props: {
                  span: 6,
                  bg_color: '',
                  padding: '20px',
                  text_align: 'left',
                  animation: 'none',
                  class: '',
                },
                children: [
                  {
                    id: generateId(),
                    type: 'button',
                    label: 'Button',
                    props: {
                      text: 'Get Started Today',
                      link: '#',
                      color: 'primary', // primary, secondary, alert, success
                      style: 'filled', // filled, outline, round, underline
                      size: 'medium', // small, medium, large
                      align: 'left',
                      class: '',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      };

    case 'row':
      return {
        id,
        type,
        label: 'Row',
        props: {
          gutter: 'medium',
          width: 'container',
          class: '',
        },
        children: [
          {
            id: generateId(),
            type: 'column',
            label: 'Column (1/2)',
            props: { span: 6 },
            children: [],
          },
          {
            id: generateId(),
            type: 'column',
            label: 'Column (1/2)',
            props: { span: 6 },
            children: [],
          },
        ],
      };

    case 'column':
      return {
        id,
        type,
        label: 'Column',
        props: {
          span: 4,
          bg_color: '',
          padding: '15px',
          text_align: 'left',
          animation: 'none',
          class: '',
        },
        children: [],
      };

    case 'text':
      return {
        id,
        type,
        label: 'Text',
        props: {
          text: '<h3>Awesome Title</h3><p>Enter your professional description text block right here inline or via the Inspector editor sidebar.</p>',
          class: '',
        },
        children: [],
      };

    case 'image':
      return {
        id,
        type,
        label: 'Image',
        props: {
          url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          width: '100%',
          height: 'auto',
          align: 'center',
          radius: '4px',
          hover_effect: 'zoom', // none, zoom, fade, glow
          link: '',
          class: '',
        },
        children: [],
      };

    case 'button':
      return {
        id,
        type,
        label: 'Button',
        props: {
          text: 'Explore Works',
          link: '#',
          color: 'primary',
          style: 'filled',
          size: 'medium',
          align: 'center',
          class: '',
        },
        children: [],
      };

    case 'slider':
      return {
        id,
        type,
        label: 'Slider',
        props: {
          height: '400px',
          arrows: true,
          bullets: true,
          auto_play: false,
          class: '',
        },
        children: [
          {
            id: generateId(),
            type: 'section',
            label: 'Slide 1',
            props: {
              bg_color: '#1e293b',
              padding_top: '100px',
              padding_bottom: '100px',
              overlay: 'rgba(0,0,0,0.3)',
              class: '',
            },
            children: [
              {
                id: generateId(),
                type: 'row',
                label: 'Row',
                props: { gutter: 'medium', width: 'container' },
                children: [
                  {
                    id: generateId(),
                    type: 'column',
                    label: 'Column',
                    props: { span: 12, text_align: 'center' },
                    children: [
                      {
                        id: generateId(),
                        type: 'text',
                        label: 'Text',
                        props: {
                          text: '<h1 style="color:#ffffff;">Slide Title 1</h1><p style="color:#e2e8f0;">Flick through multiple slides seamlessly with layout options.</p>',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: generateId(),
            type: 'section',
            label: 'Slide 2',
            props: {
              bg_color: '#0f172a',
              padding_top: '100px',
              padding_bottom: '100px',
              overlay: 'rgba(0,0,0,0.4)',
              class: '',
            },
            children: [
              {
                id: generateId(),
                type: 'row',
                label: 'Row',
                props: { gutter: 'medium', width: 'container' },
                children: [
                  {
                    id: generateId(),
                    type: 'column',
                    label: 'Column',
                    props: { span: 12, text_align: 'center' },
                    children: [
                      {
                        id: generateId(),
                        type: 'text',
                        label: 'Text',
                        props: {
                          text: '<h1 style="color:#ffffff;">Fabulous Slide 2</h1><p style="color:#e2e8f0;">Endless creative structures, banners and overlays.</p>',
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

    case 'gallery':
      return {
        id,
        type,
        label: 'Gallery',
        props: {
          columns: 3,
          spacing: 'medium',
          type: 'grid', // grid, masonry
          class: '',
          images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&q=80',
          ],
        },
        children: [],
      };

    case 'video':
      return {
        id,
        type,
        label: 'Video',
        props: {
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          aspect: '16:9',
          autoplay: false,
          loop: false,
          class: '',
        },
        children: [],
      };

    case 'map':
      return {
        id,
        type,
        label: 'Map',
        props: {
          address: 'Hanoi, Vietnam',
          zoom: 14,
          height: '350px',
          class: '',
        },
        children: [],
      };

    case 'gap':
      return {
        id,
        type,
        label: 'Gap',
        props: {
          height: '30px',
          class: '',
        },
        children: [],
      };

    case 'divider':
      return {
        id,
        type,
        label: 'Divider',
        props: {
          width: '100px',
          color: '#cbd5e1',
          thickness: '3px',
          align: 'center',
          style: 'solid', // solid, dashed, dotted, double
          class: '',
        },
        children: [],
      };

    case 'icon':
      return {
        id,
        type,
        label: 'Icon',
        props: {
          name: 'Heart', // Star, Shield, Smartphone, Laptop...
          size: '40px',
          color: '#0ea5e9',
          bg_type: 'none', // none, circle, square
          bg_color: '',
          align: 'center',
          class: '',
        },
        children: [],
      };

    default:
      throw new Error(`Unsupported element type: ${type}`);
  }
}

// Re-generate all IDs inside element tree to duplicate cleanly without ID clashing
export function reassignIds(element: UXElement): UXElement {
  const newId = generateId();
  const children = element.children
    ? element.children.map((child) => reassignIds(child))
    : [];
  return {
    ...element,
    id: newId,
    children,
  };
}

// Convert JSON Tree structure to Wordpress Flatsome Shortcode structure
export function convertToShortcodes(elements: UXElement[]): string {
  let shortcode = '';

  elements.forEach((el) => {
    const propsArr: string[] = [];
    Object.entries(el.props).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // format arrays safely (e.g. for gallery images)
        if (Array.isArray(value)) {
          propsArr.push(`${key}="${value.join(',')}"`);
        } else {
          propsArr.push(`${key}="${String(value).replace(/"/g, '&quot;')}"`);
        }
      }
    });

    const propsStr = propsArr.length > 0 ? ' ' + propsArr.join(' ') : '';

    if (el.children && el.children.length > 0) {
      shortcode += `[${el.type}${propsStr}]\n`;
      shortcode += convertToShortcodes(el.children);
      shortcode += `[/${el.type}]\n`;
    } else {
      if (el.type === 'text') {
        shortcode += `[text${propsStr}]${el.props.text || ''}[/text]\n`;
      } else {
        shortcode += `[${el.type}${propsStr}]\n`;
      }
    }
  });

  return shortcode;
}

// Parses string-based shortcodes into structured JSON array
// (Provides resilient parser that understands nested structures Section -> Row -> Column)
export function parseShortcodes(text: string): UXElement[] {
  // A resilient state machine parser to decode flatsome codes
  const result: UXElement[] = [];
  const lines = text.split('\n');

  // Let's create an elegant parser that parses typical tags.
  // We'll write a nested stack-based tag compiler.
  const stack: UXElement[] = [];

  // Match: [tag_name attr1="val" attr2="val"] or [/tag_name]
  const tagRegex = /\[(\/)?([a-zA-Z0-9_]+)([^\]]*)\]/g;

  // For a reliable parser, we can parse the whole string sequentially. Let's do it token by token!
  let lastIndex = 0;
  let match;

  while ((match = tagRegex.exec(text)) !== null) {
    const isClosing = !!match[1];
    const type = match[2].toLowerCase() as ElementType;
    const propsString = match[3] || '';
    const startIdx = match.index;

    // Handle intermediate raw text (especially for [text] content)
    if (stack.length > 0 && lastIndex < startIdx) {
      const betweenText = text.substring(lastIndex, startIdx).trim();
      const parent = stack[stack.length - 1];
      if (parent && parent.type === 'text' && betweenText) {
        parent.props.text = (parent.props.text || '') + betweenText;
      }
    }

    if (!isClosing) {
      // Parse props
      const props: Record<string, any> = {};
      const attrRegex = /([a-zA-Z0-9_-]+)="([^"]*)"/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(propsString)) !== null) {
        const key = attrMatch[1];
        let val: any = attrMatch[2];
        if (key === 'images') {
          val = val.split(',');
        } else if (val === 'true') {
          val = true;
        } else if (val === 'false') {
          val = false;
        } else if (!isNaN(Number(val)) && val.trim() !== '') {
          val = Number(val);
        }
        props[key] = val;
      }

      // Default label or assign from template
      const template = createElementTemplate(type);
      const newElement: UXElement = {
        id: generateId(),
        type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        props: { ...template.props, ...props },
        children: [],
      };

      if (stack.length > 0) {
        stack[stack.length - 1].children.push(newElement);
      } else {
        result.push(newElement);
      }

      // If it has closing tag or is a block container, push it to stack
      const openTypes = ['section', 'row', 'column', 'slider', 'gallery', 'text'];
      if (openTypes.includes(type)) {
        stack.push(newElement);
      }
    } else {
      // Closing tag: pop from stack
      if (stack.length > 0 && stack[stack.length - 1].type === type) {
        stack.pop();
      }
    }

    lastIndex = tagRegex.lastIndex;
  }

  // If stack remains, safely pop them
  if (result.length === 0 && text.trim().length > 0) {
    // Generate fallback template
    const section = createElementTemplate('section');
    section.children[0].children[0].children = [
      {
        id: generateId(),
        type: 'text',
        label: 'Text',
        props: { text: text },
        children: [],
      },
    ];
    return [section];
  }

  return result.length > 0 ? result : getDefaultLayout();
}

// Starting Mock Standard Template for UX Builder
export function getDefaultLayout(): UXElement[] {
  const sectionId1 = generateId();
  const rowId1 = generateId();
  const colId1 = generateId();
  const colId2 = generateId();

  return [
    {
      id: sectionId1,
      type: 'section',
      label: 'Hero Section',
      props: {
        bg_color: '#0f172a',
        bg_image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
        padding_top: '120px',
        padding_bottom: '120px',
        overlay: 'rgba(15, 23, 42, 0.85)',
        border_width: '0px',
        border_color: '',
        class: '',
      },
      children: [
        {
          id: rowId1,
          type: 'row',
          label: 'Brand row',
          props: {
            gutter: 'large',
            width: 'container',
            class: '',
          },
          children: [
            {
              id: colId1,
              type: 'column',
              label: 'Hero Content',
              props: {
                span: 7,
                bg_color: '',
                padding: '0px',
                text_align: 'left',
                animation: 'fade-in',
                class: '',
              },
              children: [
                {
                  id: generateId(),
                  type: 'icon',
                  label: 'Logo Icon',
                  props: {
                    name: 'Cpu',
                    size: '48px',
                    color: '#38bdf8',
                    bg_type: 'none',
                    align: 'left',
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: 'text',
                  label: 'Heading',
                  props: {
                    text: '<h1 style="color:#ffffff; font-size:48px; line-height:1.1; margin-top:20px; font-weight:800; letter-spacing:-0.03em;">Supercharge WooCommerce with Flatsome</h1><p style="color:#94a3b8; font-size:18px; margin-top:16px; margin-bottom:24px; line-height:1.6;">The ultimate responsive Web & Layout Builder. Reorder grids, slider frames, banners, and map nodes visually in 60fps local rendering.</p>',
                    class: '',
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: 'button',
                  label: 'Button Primary',
                  props: {
                    text: 'GET CUSTOM BUILDER',
                    link: '#',
                    color: 'success',
                    style: 'filled',
                    size: 'large',
                    align: 'left',
                  },
                  children: [],
                },
              ],
            },
            {
              id: colId2,
              type: 'column',
              label: 'Visual Frame',
              props: {
                span: 5,
                bg_color: '',
                padding: '10px',
                text_align: 'center',
                animation: 'slide-up',
                class: '',
              },
              children: [
                {
                  id: generateId(),
                  type: 'image',
                  label: 'Device Mockup',
                  props: {
                    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
                    width: '100%',
                    height: 'auto',
                    align: 'center',
                    radius: '12px',
                    hover_effect: 'zoom',
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: generateId(),
      type: 'section',
      label: 'Feature Section',
      props: {
        bg_color: '#ffffff',
        padding_top: '80px',
        padding_bottom: '80px',
        overlay: 'rgba(0,0,0,0)',
        border_width: '1px',
        border_color: '#e2e8f0',
      },
      children: [
        {
          id: generateId(),
          type: 'row',
          label: 'Grid Header',
          props: { gutter: 'medium', width: 'container' },
          children: [
            {
              id: generateId(),
              type: 'column',
              label: 'Header Col',
              props: { span: 12, text_align: 'center' },
              children: [
                {
                  id: generateId(),
                  type: 'text',
                  label: 'Introduction Text',
                  props: {
                    text: '<h2 style="font-size:32px; font-weight:700; color:#0f172a;">Drag-and-Drop Power Suite</h2><p style="color:#64748b; margin-top:4px; max-width:600px; margin-left:auto; margin-right:auto;">Discover standard elements you can place, re-nest, delete, and duplicate in our layout navigator.</p>',
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: 'divider',
                  label: 'Divider accent',
                  props: {
                    width: '60px',
                    color: '#3b82f6',
                    thickness: '4px',
                    align: 'center',
                    style: 'solid',
                  },
                  children: [],
                },
                {
                  id: generateId(),
                  type: 'gap',
                  label: 'Gap small',
                  props: { height: '30px' },
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: generateId(),
          type: 'row',
          label: 'Feature Features',
          props: { gutter: 'medium', width: 'container' },
          children: [
            {
              id: generateId(),
              type: 'column',
              label: 'Card Left',
              props: {
                span: 4,
                bg_color: '#f8fafc',
                padding: '30px',
                class: 'border border-slate-100 rounded-xl hover:shadow-lg transition-all',
              },
              children: [
                {
                  id: generateId(),
                  type: 'icon',
                  label: 'Fast Icon',
                  props: { name: 'Zap', size: '36px', color: '#eab308', align: 'left' },
                  children: [],
                },
                {
                  id: generateId(),
                  type: 'text',
                  label: 'Fast Title',
                  props: {
                    text: '<h4 style="font-size:18px; font-weight:600; color:#0f172a; margin-top:12px;">Ultra-fast React State</h4><p style="color:#64748b; font-size:14px; margin-top:8px;">Instant state dispatch keeps FPS at absolute maximum while editing complex nested layouts.</p>',
                  },
                  children: [],
                },
              ],
            },
            {
              id: generateId(),
              type: 'column',
              label: 'Card Center',
              props: {
                span: 4,
                bg_color: '#f8fafc',
                padding: '30px',
                class: 'border border-slate-100 rounded-xl hover:shadow-lg transition-all',
              },
              children: [
                {
                  id: generateId(),
                  type: 'icon',
                  label: 'Customizer Icon',
                  props: { name: 'Sliders', size: '36px', color: '#10b981', align: 'left' },
                  children: [],
                },
                {
                  id: generateId(),
                  type: 'text',
                  label: 'Customizer Title',
                  props: {
                    text: '<h4 style="font-size:18px; font-weight:600; color:#0f172a; margin-top:12px;">Unlimited Presets</h4><p style="color:#64748b; font-size:14px; margin-top:8px;">Control columns width, padding buffers, backgrounds, overlay filters, and border curves easily.</p>',
                  },
                  children: [],
                },
              ],
            },
            {
              id: generateId(),
              type: 'column',
              label: 'Card Right',
              props: {
                span: 4,
                bg_color: '#f8fafc',
                padding: '30px',
                class: 'border border-slate-100 rounded-xl hover:shadow-lg transition-all',
              },
              children: [
                {
                  id: generateId(),
                  type: 'icon',
                  label: 'Responsive Icon',
                  props: { name: 'Smartphone', size: '36px', color: '#3b82f6', align: 'left' },
                  children: [],
                },
                {
                  id: generateId(),
                  type: 'text',
                  label: 'Responsive Title',
                  props: {
                    text: '<h4 style="font-size:18px; font-weight:600; color:#0f172a; margin-top:12px;">100% Mobile Ready</h4><p style="color:#64748b; font-size:14px; margin-top:8px;">Viewport swapper replicates device grids so your clients get perfect mobile viewports.</p>',
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}
