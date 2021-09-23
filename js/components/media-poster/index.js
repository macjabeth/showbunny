import sheet from './style';

class MediaPoster extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const template = document.getElementById('media-poster');
    const clone = template.content.cloneNode(true);

    shadow.appendChild(clone);
    shadow.adoptedStyleSheets = [sheet];
  }
}

customElements.define('media-poster', MediaPoster);
