const sheet = new CSSStyleSheet();

sheet.replaceSync(`
  .card {
    padding: 1.6rem;
    display: grid;
    grid-auto-flow: row;
    background-color: var(--bg-light);
    border-radius: 1rem;
  }

  .card-image {
    max-width: 100%;
    border-radius: 1rem;
  }

  .card-title {
    margin-bottom: .8rem;
  }

  .card-meta {
    display: flex;
    align-items: center;
  }

  .card-year {
    color: var(--grey);
    margin-right: 1.6rem;
  }

  .card-rating::before {
    content: '⭐';
    margin-left: -5px;
    margin-right: 2.5px;
  }

  .card-overview {
    margin: 2.4rem 0;
  }

  .card-genres {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .card-genre {
    color: var(--bg-color);
    background-color: var(--orange);
    padding: .8rem 1.6rem;
    border-radius: 1rem;
    font-weight: bold;
  }
`);

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
