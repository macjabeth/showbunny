import sheet from './style';

class MediaCard extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const template = document.getElementById('media-card');
    const clone = template.content.cloneNode(true);

    shadow.appendChild(clone);
    shadow.adoptedStyleSheets = [sheet];
  }
}

customElements.define('media-card', MediaCard);
