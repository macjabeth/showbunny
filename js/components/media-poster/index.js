import sheet from './style';
import template from './template';

class MediaPoster extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const clone = template.content.cloneNode(true);

    shadow.appendChild(clone);
    shadow.adoptedStyleSheets = [sheet];
  }
}

customElements.define('media-poster', MediaPoster);
