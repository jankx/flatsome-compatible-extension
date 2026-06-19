import {describe, it, expect} from 'vitest';
import {render, fireEvent} from '@solidjs/testing-library';
import App from '../App';

describe('App', () => {
  it('renders the toolbar', () => {
    const {container} = render(() => <App />);
    expect(container.querySelector('#ux-builder-toolbar')).toBeTruthy();
  });

  it('renders left sidebar with Navigator heading', () => {
    const {container} = render(() => <App />);
    expect(container.querySelector('#ux-builder-left-sidebar')).toBeTruthy();
    const navHeading = container.querySelector('#ux-builder-left-sidebar h3');
    expect(navHeading).toBeTruthy();
    expect(navHeading?.textContent).toMatch(/Navigator/i);
  });

  it('renders canvas area with wrapper', () => {
    const {container} = render(() => <App />);
    expect(container.querySelector('#ux-builder-canvas-wrapper')).toBeTruthy();
  });

  it('renders right sidebar', () => {
    const {container} = render(() => <App />);
    expect(container.querySelector('#ux-builder-right-sidebar')).toBeTruthy();
  });

  it('opens element library on button click', () => {
    const {container} = render(() => <App />);
    const addBtn = container.querySelector('#ux-builder-left-sidebar button');
    expect(addBtn).toBeTruthy();
    if (addBtn) fireEvent.click(addBtn);
    const libTitle = container.querySelector('h4');
    const hasLibraryTitle = libTitle && libTitle.textContent?.match(/Elements/i);
    expect(hasLibraryTitle).toBeTruthy();
  });
});
