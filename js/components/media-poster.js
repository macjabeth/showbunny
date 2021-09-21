const sheet = new CSSStyleSheet();

sheet.replaceSync(`
  .card {
    border-radius: 0.4rem;
    color: var(--fg-color);
    flex-shrink: 0;
    position: relative;
    width: 154px;
  }

  .card-image {
    display: block;
    max-width: 100%;
    height: auto;
  }

  .badge {
    background-color: var(--bg-color);
    border-radius: 0.8rem;
    font-size: 1.2rem;
    opacity: 0.75;
    padding: 0.4rem 0.8rem;
  }

  .card-rating {
    left: 5px;
    position: absolute;
    top: 5px;
  }

  .card-rating::before {
    content: '⭐';
    margin-left: -5px;
    margin-right: 2.5px;
  }

  .card-episode-count {
    position: absolute;
    right: 5px;
    top: 5px;
  }

  .card-episode-count::before {
    content: '📺';
    margin-left: -5px;
    margin-right: 2.5px;
  }

  @media screen and (min-width: 600px) {
    .card {
      width: 185px;
    }
  }

  @media screen and (min-width: 1024px) {
    .card {
      width: 342px;
    }

    .badge {
      font-size: initial;
    }
  }

  @media screen and (min-width: 2560px) {
    .card {
      width: 500px;
    }
  }
`);

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
