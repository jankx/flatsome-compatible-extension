import {describe, it, expect} from 'vitest';
import {
  generateId,
  deepCloneElements,
  findElementWithParent,
  findElement,
  createElementTemplate,
  reassignIds,
  convertToShortcodes,
  parseShortcodes,
  getDefaultLayout,
} from '../utils';
import {UXElement, ElementType} from '../types';

describe('generateId', () => {
  it('generates a string of 7 characters', () => {
    const id = generateId();
    expect(id).toHaveLength(7);
  });

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({length: 100}, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe('deepCloneElements', () => {
  it('creates a deep copy of elements array', () => {
    const el: UXElement = {id: '1', type: 'section', label: 'Test', props: {bg_color: '#fff'}, children: []};
    const cloned = deepCloneElements([el]);
    expect(cloned).toEqual([el]);
    expect(cloned).not.toBe([el]);
    expect(cloned[0]).not.toBe(el);
  });

  it('deeply clones nested children', () => {
    const el: UXElement = {
      id: '1', type: 'section', label: 'S', props: {},
      children: [{id: '2', type: 'row', label: 'R', props: {}, children: []}],
    };
    const cloned = deepCloneElements([el]);
    expect(cloned[0].children[0]).not.toBe(el.children[0]);
  });
});

describe('findElementWithParent', () => {
  const elements: UXElement[] = [
    {id: '1', type: 'section', label: 'S', props: {}, children: [
      {id: '2', type: 'row', label: 'R', props: {}, children: [
        {id: '3', type: 'col', label: 'C', props: {}, children: []},
      ]},
    ]},
  ];

  it('finds root element', () => {
    const result = findElementWithParent(elements, '1');
    expect(result).not.toBeNull();
    expect(result!.element.id).toBe('1');
    expect(result!.parent).toBeNull();
    expect(result!.index).toBe(0);
  });

  it('finds nested element with parent', () => {
    const result = findElementWithParent(elements, '3');
    expect(result).not.toBeNull();
    expect(result!.element.id).toBe('3');
    expect(result!.parent!.id).toBe('2');
    expect(result!.index).toBe(0);
  });

  it('returns null for non-existent id', () => {
    expect(findElementWithParent(elements, 'nonexistent')).toBeNull();
  });
});

describe('findElement', () => {
  const elements: UXElement[] = [
    {id: '1', type: 'section', label: 'S', props: {}, children: [
      {id: '2', type: 'row', label: 'R', props: {}, children: []},
    ]},
  ];

  it('finds element by id', () => {
    expect(findElement(elements, '2')?.id).toBe('2');
  });

  it('returns null for non-existent id', () => {
    expect(findElement(elements, 'x')).toBeNull();
  });
});

describe('createElementTemplate', () => {
  const layoutTypes: ElementType[] = ['section', 'row', 'col', 'text', 'button', 'ux_image', 'gap', 'divider', 'ux_banner', 'title', 'featured_box', 'ux_slider', 'ux_gallery', 'ux_video', 'map', 'accordion', 'tabgroup', 'block', 'message_box', 'ux_countdown', 'share', 'follow', 'search', 'ux_logo', 'ux_image_box', 'row_inner', 'col_inner', 'text_box', 'ux_text', 'scroll_to', 'accordion-item', 'tab'];

  it.each(layoutTypes)('creates a valid %s element', (type) => {
    const el = createElementTemplate(type);
    expect(el.type).toBe(type);
    expect(el.id).toHaveLength(7);
    expect(typeof el.label).toBe('string');
    expect(el.props).toBeDefined();
    expect(Array.isArray(el.children)).toBe(true);
  });

  it('section has a row child by default', () => {
    const el = createElementTemplate('section');
    expect(el.children.length).toBe(1);
    expect(el.children[0].type).toBe('row');
  });

  it('row has 2 column children by default', () => {
    const el = createElementTemplate('row');
    expect(el.children.length).toBe(2);
    expect(el.children[0].type).toBe('col');
    expect(el.children[1].type).toBe('col');
  });

  it('ux_slider has 2 section children by default', () => {
    const el = createElementTemplate('ux_slider');
    expect(el.children.length).toBe(2);
    expect(el.children[0].type).toBe('section');
  });

  it('accordion has 2 accordion-item children by default', () => {
    const el = createElementTemplate('accordion');
    expect(el.children.length).toBe(2);
    expect(el.children[0].type).toBe('accordion-item');
  });

  it('tabgroup has 2 tab children by default', () => {
    const el = createElementTemplate('tabgroup');
    expect(el.children.length).toBe(2);
    expect(el.children[0].type).toBe('tab');
  });

  it('col has default span of 4', () => {
    const el = createElementTemplate('col');
    expect(el.props.span).toBe(4);
  });

  it('gap has default height of 30px', () => {
    const el = createElementTemplate('gap');
    expect(el.props.height).toBe('30px');
  });

  it('ux_banner has a text_box child', () => {
    const el = createElementTemplate('ux_banner');
    expect(el.children.length).toBe(1);
    expect(el.children[0].type).toBe('text_box');
  });

  it('row_inner has a col_inner child', () => {
    const el = createElementTemplate('row_inner');
    expect(el.children[0].type).toBe('col_inner');
  });

  it('throws for unknown type', () => {
    expect(() => createElementTemplate('unknown' as ElementType)).toThrow('Unsupported element type: unknown');
  });
});

describe('reassignIds', () => {
  it('reassigns all IDs in an element tree', () => {
    const el: UXElement = {
      id: '1', type: 'section', label: 'S', props: {},
      children: [
        {id: '2', type: 'row', label: 'R', props: {}, children: [
          {id: '3', type: 'col', label: 'C', props: {}, children: []},
        ]},
      ],
    };
    const cloned = reassignIds(el);
    expect(cloned.id).not.toBe('1');
    expect(cloned.children[0].id).not.toBe('2');
    expect(cloned.children[0].children[0].id).not.toBe('3');
  });
});

describe('convertToShortcodes', () => {
  it('converts a section element to shortcode', () => {
    const el = createElementTemplate('section');
    const output = convertToShortcodes([el]);
    expect(output).toContain('[section');
    expect(output).toContain('[/section]');
  });

  it('uses correct Flatsome shortcode names', () => {
    const col = createElementTemplate('col');
    const output = convertToShortcodes([col]);
    expect(output).toMatch(/^\[col/);

    const image = createElementTemplate('ux_image');
    const imgOut = convertToShortcodes([image]);
    expect(imgOut).toMatch(/^\[ux_image/);
  });

  it('outputs shortcode for self-closing elements', () => {
    const gap = createElementTemplate('gap');
    const output = convertToShortcodes([gap]);
    expect(output).toMatch(/^\[gap/);
    expect(output).not.toContain('[/gap]');
  });

  it('renders text content between tags', () => {
    const text = createElementTemplate('text');
    text.props.text = '<p>Hello</p>';
    const output = convertToShortcodes([text]);
    expect(output).toContain('[text');
    expect(output).toContain('[/text]');
    expect(output).toContain('<p>Hello</p>');
  });

  it('nests shortcodes properly', () => {
    const section = createElementTemplate('section');
    const output = convertToShortcodes([section]);
    const lines = output.split('\n').map((l) => l.trim()).filter(Boolean);
    expect(lines[0]).toMatch(/^\[section/);
    expect(lines[lines.length - 1]).toBe('[/section]');
  });
});

describe('parseShortcodes', () => {
  it('parses a simple section shortcode', () => {
    const sc = '[section bg_color="#fff"][/section]';
    const result = parseShortcodes(sc);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('section');
  });

  it('parses nested shortcodes', () => {
    const sc = '[section][row][col span="6"]Content[/col][/row][/section]';
    const result = parseShortcodes(sc);
    expect(result[0].type).toBe('section');
    expect(result[0].children[0].type).toBe('row');
    expect(result[0].children[0].children[0].type).toBe('col');
  });

  it('parses shortcode attributes', () => {
    const sc = '[section bg_color="#0f172a" padding="60px"][/section]';
    const result = parseShortcodes(sc);
    expect(result[0].props.bg_color).toBe('#0f172a');
    expect(result[0].props.padding).toBe('60px');
  });

  it('parses numeric attributes', () => {
    const sc = '[col span="6"][/col]';
    const result = parseShortcodes(sc);
    expect(result[0].props.span).toBe(6);
  });

  it('parses boolean attributes', () => {
    const sc = '[ux_slider auto_slide="true"][/ux_slider]';
    const result = parseShortcodes(sc);
    expect(result[0].props.auto_slide).toBe(true);
  });

  it('handles accordion shortcodes', () => {
    const sc = '[accordion][accordion-item title="Item 1"]Content[/accordion-item][/accordion]';
    const result = parseShortcodes(sc);
    expect(result[0].type).toBe('accordion');
  });

  it('falls back to default layout for empty input', () => {
    const result = parseShortcodes('');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('getDefaultLayout', () => {
  it('returns a non-empty array', () => {
    const layout = getDefaultLayout();
    expect(layout.length).toBeGreaterThan(0);
  });

  it('starts with a section', () => {
    const layout = getDefaultLayout();
    expect(layout[0].type).toBe('section');
  });

  it('contains featured_box elements for features', () => {
    const layout = getDefaultLayout();
    const allTypes = JSON.stringify(layout);
    expect(allTypes).toContain('featured_box');
  });
});

describe('convertToShortcodes <-> parseShortcodes roundtrip', () => {
  it('preserves element structure through conversion', () => {
    const layout = getDefaultLayout();
    const shortcodes = convertToShortcodes(layout);
    const parsed = parseShortcodes(shortcodes);

    expect(parsed.length).toBe(layout.length);
    expect(parsed[0].type).toBe(layout[0].type);
    expect(parsed[0].children.length).toBe(layout[0].children.length);
  });
});
