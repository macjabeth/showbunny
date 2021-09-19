const sheet = new CSSStyleSheet();

sheet.replaceSync(`
  .card {
    border-radius: 0.25rem;
    color: var(--fg-color);
    flex-shrink: 0;
    position: relative;
    width: 154px;
  }

  .card__image {
    display: block;
    max-width: 100%;
    width: calc(100% - 5px);
    height: auto;
  }

  .badge {
    background-color: var(--bg-color);
    border-radius: 0.5rem;
    font-size: 0.75rem;
    opacity: 0.75;
    padding: 0.25rem 0.5rem;
  }

  .card__rating {
    left: 5px;
    position: absolute;
    top: 5px;
  }

  .card__rating::before {
    content: '⭐';
    margin-left: -5px;
    margin-right: 2.5px;
  }

  .card__episode-count {
    position: absolute;
    right: 10px;
    top: 5px;
  }

  .card__episode-count::before {
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
      font-size: 1rem;
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
