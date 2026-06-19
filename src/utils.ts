import { UXElement, ElementType, FLATSOME_SELF_CLOSING, FLATSOME_CONTAINERS } from './types';

export function generateId(): string {
  return `${Math.random().toString(36).substring(2, 9)}`;
}

export function deepCloneElements(elements: UXElement[]): UXElement[] {
  return JSON.parse(JSON.stringify(elements));
}

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

export function findElement(elements: UXElement[], id: string): UXElement | null {
  const result = findElementWithParent(elements, id);
  return result ? result.element : null;
}

export function createElementTemplate(type: ElementType): UXElement {
  const id = generateId();
  switch (type) {
    case 'section':
      return {
        id, type, label: 'Section',
        props: { bg_color: '#f8fafc', bg: '', bg_overlay: '', padding: '60px 0px 60px 0px', dark: false, class: '', visibility: '' },
        children: [createElementTemplate('row')],
      };

    case 'row':
      return {
        id, type, label: 'Row',
        props: { gap: 'normal', width: '', custom_width: '', h_align: 'left', v_align: '', col_bg: '', col_bg_radius: '', depth: '', depth_hover: '', class: '', visibility: '' },
        children: [
          { id: generateId(), type: 'col', label: 'Column 1/2', props: { span: 6, span__sm: 12, padding: '15px', text_align: 'left' }, children: [] },
          { id: generateId(), type: 'col', label: 'Column 2/2', props: { span: 6, span__sm: 12, padding: '15px', text_align: 'left' }, children: [] },
        ],
      };

    case 'row_inner':
      return {
        id, type, label: 'Row Inner',
        props: { gap: 'normal', class: '' },
        children: [
          { id: generateId(), type: 'col_inner', label: 'Inner Col', props: { span: 12, padding: '15px' }, children: [] },
        ],
      };

    case 'col':
      return {
        id, type, label: 'Column',
        props: { span: 4, span__sm: 12, span__md: '', padding: '15px', padding__sm: '', padding__md: '', bg: '', bg_color: '', bg_radius: '', text_align: 'left', text_color: '', animate: '', class: '', visibility: '' },
        children: [],
      };

    case 'col_inner':
      return {
        id, type, label: 'Inner Column',
        props: { span: 12, span__sm: 12, padding: '15px', text_align: 'left', class: '' },
        children: [],
      };

    case 'ux_banner':
      return {
        id, type, label: 'Banner',
        props: { bg: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80', bg_color: '', bg_overlay: 'rgba(0,0,0,0.3)', height: '400px', container_width: '', parallax: '', hover: 'zoom', slide_effect: '', text_color: 'light', text_align: 'center', text_pos: 'center', text_width: '60', padding: '30px', animate: '', link: '', target: '', class: '', visibility: '' },
        children: [createElementTemplate('text_box')],
      };

    case 'text_box':
      return {
        id, type, label: 'Text Box',
        props: { position_x: '50', position_y: '50', width: '60', scale: '', text_align: 'center', text_color: 'light', animate: '', class: '', visibility: '' },
        children: [createElementTemplate('text')],
      };

    case 'text':
    case 'ux_text':
      return {
        id, type, label: 'Text',
        props: { text: '<h2>Heading Here</h2><p>Your content goes here.</p>', class: '', visibility: '' },
        children: [],
      };

    case 'title':
      return {
        id, type, label: 'Title',
        props: { text: 'Section Title', style: 'lined', size: 'normal', sub_text: '', color: '', class: '' },
        children: [],
      };

    case 'ux_image':
      return {
        id, type, label: 'Image',
        props: { id: '', image_size: 'full', width: '', height: '', margin: '', lightbox: true, caption: true, image_hover: 'zoom', image_overlay: '', depth: '', depth_hover: '', animate: '', link: '', target: '', class: '', visibility: '' },
        children: [],
      };

    case 'button':
      return {
        id, type, label: 'Button',
        props: { text: 'Button', link: '#', style: '', color: 'primary', size: 'normal', radius: '', expand: false, icon: '', icon_pos: 'right', depth: '', depth_hover: '', animate: '', class: '', visibility: '' },
        children: [],
      };

    case 'featured_box':
      return {
        id, type, label: 'Feature Box',
        props: { img: '', img_width: '48', pos: 'top', title: 'Feature Title', text: 'Feature description', icon: '', icon_color: '#3b82f6', icon_size: '32px', link: '', target: '', depth: '', depth_hover: '', animate: '', bg_color: '', padding: '15px', class: '', visibility: '' },
        children: [],
      };

    case 'ux_slider':
      return {
        id, type, label: 'Slider',
        props: { style: 'normal', slide_width: '', slide_align: 'left', bg_color: '', margin: '', infinitive: true, freescroll: false, draggable: true, hide_nav: false, nav_pos: '', nav_size: 'normal', arrows: true, nav_style: 'circle', nav_color: 'dark', bullets: true, auto_slide: false, timer: 4000, class: '', visibility: '' },
        children: [
          { id: generateId(), type: 'section', label: 'Slide 1', props: { bg_color: '#1e293b', padding: '100px 0px 100px 0px', bg_overlay: 'rgba(0,0,0,0.3)', dark: true }, children: [createDefaultRowWithText('Slide 1 Title', 'Slide description here.')] },
          { id: generateId(), type: 'section', label: 'Slide 2', props: { bg_color: '#0f172a', padding: '100px 0px 100px 0px', bg_overlay: 'rgba(0,0,0,0.4)', dark: true }, children: [createDefaultRowWithText('Slide 2 Title', 'Another slide description.')] },
        ],
      };

    case 'ux_gallery':
      return {
        id, type, label: 'Gallery',
        props: { ids: '', style: 'grid', columns: '3', image_size: 'medium', image_hover: 'zoom', animate: '', class: '', visibility: '' },
        children: [],
      };

    case 'ux_video':
      return {
        id, type, label: 'Video',
        props: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', width: '', height: '', class: '', visibility: '' },
        children: [],
      };

    case 'map':
      return {
        id, type, label: 'Map',
        props: { lat: '21.0285', long: '105.8542', height: '350px', zoom: '14', address: 'Hanoi, Vietnam', content: '', class: '', visibility: '' },
        children: [],
      };

    case 'gap':
      return {
        id, type, label: 'Gap',
        props: { height: '30px', class: '', visibility: '' },
        children: [],
      };

    case 'divider':
      return {
        id, type, label: 'Divider',
        props: { width: '100px', color: '#cbd5e1', thickness: '3px', align: 'center', style: 'solid', class: '', visibility: '' },
        children: [],
      };

    case 'scroll_to':
      return {
        id, type, label: 'Scroll To',
        props: { title: '', bullet: 'true', class: '' },
        children: [],
      };

    case 'accordion':
      return {
        id, type, label: 'Accordion',
        props: { title: 'Accordion', auto_open: false, open_multi: false, class: '' },
        children: [
          { id: generateId(), type: 'accordion-item', label: 'Item 1', props: { title: 'Item 1 Title' }, children: [createDefaultText()] },
          { id: generateId(), type: 'accordion-item', label: 'Item 2', props: { title: 'Item 2 Title' }, children: [createDefaultText()] },
        ],
      };

    case 'accordion-item':
      return {
        id, type, label: 'Accordion Item',
        props: { title: 'Accordion Item', class: '' },
        children: [],
      };

    case 'tabgroup':
      return {
        id, type, label: 'Tab Group',
        props: { type: 'horizontal', nav_style: 'normal', nav_size: '', nav_pos: '', class: '' },
        children: [
          { id: generateId(), type: 'tab', label: 'Tab 1', props: { title: 'Tab 1' }, children: [createDefaultText()] },
          { id: generateId(), type: 'tab', label: 'Tab 2', props: { title: 'Tab 2' }, children: [createDefaultText()] },
        ],
      };

    case 'tab':
      return {
        id, type, label: 'Tab',
        props: { title: 'Tab', class: '' },
        children: [],
      };

    case 'block':
      return {
        id, type, label: 'Block',
        props: { id: '', class: '' },
        children: [],
      };

    case 'message_box':
      return {
        id, type, label: 'Message Box',
        props: { bg_color: '#f0f9ff', text_color: 'dark', class: '' },
        children: [createDefaultText()],
      };

    case 'ux_countdown':
      return {
        id, type, label: 'Countdown',
        props: { date: '2025/12/31', time: '23:59', size: 'normal', bg_color: '', translucent: false, class: '' },
        children: [],
      };

    case 'share':
      return {
        id, type, label: 'Share Icons',
        props: { style: 'small', align: 'center', class: '' },
        children: [],
      };

    case 'follow':
      return {
        id, type, label: 'Follow Icons',
        props: { style: 'small', align: 'center', class: '' },
        children: [],
      };

    case 'search':
      return {
        id, type, label: 'Search',
        props: { style: 'normal', size: 'normal', class: '' },
        children: [],
      };

    case 'ux_logo':
      return {
        id, type, label: 'Logo',
        props: { img: '', image_size: 'full', link: '', target: '', depth: '', class: '' },
        children: [],
      };

    case 'ux_image_box':
      return {
        id, type, label: 'Image Box',
        props: { img: '', image_size: 'full', title: 'Image Title', text: 'Image description', link: '', target: '', image_hover: 'zoom', depth: '', text_pos: 'bottom', animate: '', class: '' },
        children: [],
      };

    default:
      throw new Error(`Unsupported element type: ${type}`);
  }
}

function createDefaultRowWithText(title: string, desc: string): UXElement {
  return {
    id: generateId(), type: 'row', label: 'Row',
    props: { gap: 'normal', width: '', class: '' },
    children: [{
      id: generateId(), type: 'col', label: 'Column',
      props: { span: 12, text_align: 'center', padding: '15px' },
      children: [{
        id: generateId(), type: 'text', label: 'Text',
        props: { text: `<h1 style="color:#ffffff;">${title}</h1><p style="color:#e2e8f0;">${desc}</p>` },
        children: [],
      }],
    }],
  };
}

function createDefaultText(): UXElement {
  return { id: generateId(), type: 'text', label: 'Text', props: { text: '<p>Content here.</p>' }, children: [] };
}

export function reassignIds(element: UXElement): UXElement {
  const newId = generateId();
  const children = element.children ? element.children.map((child) => reassignIds(child)) : [];
  return { ...element, id: newId, children };
}

const SHORTCODE_MAP: Record<string, string> = {
  col: 'col',
  col_inner: 'col_inner',
  row_inner: 'row_inner',
  ux_banner: 'ux_banner',
  text_box: 'text_box',
  ux_text: 'ux_text',
  ux_image: 'ux_image',
  featured_box: 'featured_box',
  ux_slider: 'ux_slider',
  ux_gallery: 'ux_gallery',
  ux_video: 'ux_video',
  ux_logo: 'ux_logo',
  ux_image_box: 'ux_image_box',
  ux_countdown: 'ux_countdown',
  scroll_to: 'scroll_to',
  accordion: 'accordion',
  'accordion-item': 'accordion-item',
  tabgroup: 'tabgroup',
  tab: 'tab',
  message_box: 'message_box',
  block: 'block',
  share: 'share',
  follow: 'follow',
  search: 'search',
  section: 'section',
  row: 'row',
  text: 'text',
  button: 'button',
  map: 'map',
  gap: 'gap',
  divider: 'divider',
  title: 'title',
};

export function convertToShortcodes(elements: UXElement[]): string {
  let output = '';
  for (const el of elements) {
    const tag = SHORTCODE_MAP[el.type] || el.type;
    const attrs: string[] = [];
    for (const [key, value] of Object.entries(el.props)) {
      if (value === undefined || value === null || value === '' || key === 'class' || key === 'visibility') continue;
      if (key === 'text' && el.type === 'text') continue;
      const encoded = Array.isArray(value) ? value.join(',') : String(value).replace(/"/g, '&quot;');
      attrs.push(`${key}="${encoded}"`);
    }
    const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : '';
    const isSelfClosing = FLATSOME_SELF_CLOSING.includes(el.type);
    if (isSelfClosing || (!el.children || el.children.length === 0)) {
      if (el.type === 'text') {
        output += `[text${attrStr}]${el.props.text || ''}[/text]\n`;
      } else {
        output += `[${tag}${attrStr}]\n`;
      }
    } else {
      output += `[${tag}${attrStr}]\n`;
      output += convertToShortcodes(el.children);
      output += `[/${tag}]\n`;
    }
  }
  return output;
}

const OPEN_TYPES = ['section', 'row', 'row_inner', 'col', 'col_inner', 'ux_banner', 'text_box', 'text', 'ux_text', 'ux_slider', 'ux_gallery', 'accordion', 'accordion-item', 'tabgroup', 'tab', 'featured_box', 'message_box'];

export function parseShortcodes(text: string): UXElement[] {
  const result: UXElement[] = [];
  const stack: UXElement[] = [];
  const tagRegex = /\[(\/)?([a-zA-Z0-9_-]+)([^\]]*)\]/g;
  let lastIndex = 0;
  let match;

  const reverseMap: Record<string, ElementType> = {};
  for (const [internal, sc] of Object.entries(SHORTCODE_MAP)) {
    reverseMap[sc] = internal as ElementType;
  }
  for (const [internal, sc] of Object.entries(SHORTCODE_MAP)) {
    if (!reverseMap[internal]) reverseMap[internal] = internal as ElementType;
  }

  while ((match = tagRegex.exec(text)) !== null) {
    const isClosing = !!match[1];
    const rawType = match[2].toLowerCase();
    const propsString = match[3] || '';
    const startIdx = match.index;

    const type = reverseMap[rawType] || (rawType as ElementType);
    const tag = SHORTCODE_MAP[type] || type;

    if (stack.length > 0 && lastIndex < startIdx) {
      const betweenText = text.substring(lastIndex, startIdx).trim();
      const parent = stack[stack.length - 1];
      if (parent && (parent.type === 'text' || parent.type === 'ux_text') && betweenText) {
        parent.props.text = (parent.props.text || '') + betweenText;
      }
    }

    if (!isClosing) {
      const props: Record<string, any> = {};
      const attrRegex = /([a-zA-Z0-9_-]+)="([^"]*)"/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(propsString)) !== null) {
        const key = attrMatch[1];
        let val: any = attrMatch[2];
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (!isNaN(Number(val)) && val.trim() !== '') val = Number(val);
        props[key] = val;
      }

      const template = createElementTemplate(type);
      const newElement: UXElement = {
        id: generateId(),
        type,
        label: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' '),
        props: { ...template.props, ...props },
        children: [],
      };

      if (stack.length > 0) {
        stack[stack.length - 1].children.push(newElement);
      } else {
        result.push(newElement);
      }

      if (OPEN_TYPES.includes(type)) {
        stack.push(newElement);
      }
    } else {
      if (stack.length > 0 && stack[stack.length - 1].type === type) {
        stack.pop();
      }
    }
    lastIndex = tagRegex.lastIndex;
  }

  if (result.length === 0 && text.trim().length > 0) {
    const section = createElementTemplate('section');
    const row = section.children[0];
    const col = row.children[0];
    col.children = [{ id: generateId(), type: 'text', label: 'Text', props: { text: text }, children: [] }];
    return [section];
  }

  return result.length > 0 ? result : getDefaultLayout();
}

export function getDefaultLayout(): UXElement[] {
  return [
    {
      id: generateId(), type: 'section', label: 'Hero Section',
      props: { bg_color: '#0f172a', bg: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80', bg_overlay: 'rgba(15, 23, 42, 0.85)', padding: '120px 0px 120px 0px', dark: true, class: '' },
      children: [{
        id: generateId(), type: 'row', label: 'Hero Row',
        props: { gap: 'normal', h_align: 'center', v_align: 'middle', class: '' },
        children: [{
          id: generateId(), type: 'col', label: 'Hero Content',
          props: { span: 12, text_align: 'center', text_color: 'light', padding: '0px', animate: 'fadeIn', class: '' },
          children: [
            { id: generateId(), type: 'text', label: 'Heading', props: { text: '<h1 style="font-size:48px;font-weight:800;letter-spacing:-0.03em;color:#ffffff;">Supercharge Your Site with Flatsome</h1><p style="font-size:18px;color:#94a3b8;margin-top:16px;">The ultimate drag-and-drop UX Builder for WooCommerce.</p>' }, children: [] },
            { id: generateId(), type: 'button', label: 'Button', props: { text: 'Get Started', link: '#', color: 'primary', size: 'large', radius: '99', class: '' }, children: [] },
          ],
        }],
      }],
    },
    {
      id: generateId(), type: 'section', label: 'Features',
      props: { bg_color: '#ffffff', padding: '80px 0px 80px 0px', class: '' },
      children: [{
        id: generateId(), type: 'row', label: 'Title Row',
        props: { gap: 'normal', class: '' },
        children: [{
          id: generateId(), type: 'col', label: 'Title Col',
          props: { span: 12, text_align: 'center', padding: '15px' },
          children: [
            { id: generateId(), type: 'title', label: 'Title', props: { text: 'Powerful Features', style: 'lined', size: 'normal', class: '' }, children: [] },
            { id: generateId(), type: 'gap', label: 'Gap', props: { height: '20px' }, children: [] },
          ],
        }],
      }, {
        id: generateId(), type: 'row', label: 'Features Row',
        props: { gap: 'normal', class: '' },
        children: [
          {
            id: generateId(), type: 'col', label: 'Feature 1',
            props: { span: 4, span__sm: 12, padding: '15px', text_align: 'center' },
            children: [
              { id: generateId(), type: 'featured_box', label: 'Feature 1', props: { icon: 'Zap', icon_color: '#eab308', icon_size: '36px', pos: 'top', title: 'Fast Performance', text: 'Optimized for speed and performance.' }, children: [] },
            ],
          },
          {
            id: generateId(), type: 'col', label: 'Feature 2',
            props: { span: 4, span__sm: 12, padding: '15px', text_align: 'center' },
            children: [
              { id: generateId(), type: 'featured_box', label: 'Feature 2', props: { icon: 'Sliders', icon_color: '#10b981', icon_size: '36px', pos: 'top', title: 'Customizable', text: 'Endless customization options.' }, children: [] },
            ],
          },
          {
            id: generateId(), type: 'col', label: 'Feature 3',
            props: { span: 4, span__sm: 12, padding: '15px', text_align: 'center' },
            children: [
              { id: generateId(), type: 'featured_box', label: 'Feature 3', props: { icon: 'Smartphone', icon_color: '#3b82f6', icon_size: '36px', pos: 'top', title: 'Responsive', text: 'Looks great on all devices.' }, children: [] },
            ],
          },
        ],
      }],
    },
  ];
}
