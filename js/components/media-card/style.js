const sheet = new CSSStyleSheet();

sheet.replaceSync(`
  :host {
    display: block;
    container-type: inline-size;
  }

  .card {
    display: grid;
    grid-template-rows: auto 1fr;
    background-color: var(--bg-card);
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
    transition: transform var(--normal), border-color var(--normal), box-shadow var(--normal);
  }

  .card:hover {
    border-color: var(--border-hover);
    box-shadow: var(--shadow-lg), 0 0 32px var(--accent-glow);
    transform: translateY(-2px);
  }

  .card-image {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
    background: var(--bg-elevated);
  }

  .card-info {
    padding: 1.4rem 1.6rem 1.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    min-width: 0;
  }

  .card-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .card-title {
    margin: 0;
    font-size: 1.7rem;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.01em;
    background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.6rem 1.2rem;
    font-size: 1.25rem;
    color: var(--text-muted);
  }

  .card-rating {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--accent);
    font-weight: 600;
  }

  .card-rating::before {
    content: '🐰';
    font-size: 1.1rem;
    line-height: 1;
  }

  .card-year { color: var(--text-muted); }

  .card-episode-count {
    font-size: 1.1rem;
    color: var(--accent);
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .card-overview {
    margin: 0;
    color: var(--text-muted);
    line-height: 1.6;
    font-size: 1.35rem;
  }

  .card-overview:empty { display: none; }

  .card-genres {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    list-style-type: none;
    margin: 0.2rem 0 0;
    padding: 0;
  }

  .card-genre {
    color: var(--accent);
    background-color: var(--accent-soft);
    padding: 0.4rem 0.9rem;
    border-radius: var(--radius-pill);
    font-weight: 500;
    font-size: 1.2rem;
    border: 1px solid rgba(245, 166, 35, 0.18);
    transition: background-color var(--fast), border-color var(--fast);
  }

  .card-genre:hover {
    background-color: rgba(245, 166, 35, 0.18);
    border-color: rgba(245, 166, 35, 0.32);
  }

  /* Container queries — layout responds to card's own width, not viewport */
  @container (min-width: 520px) {
    .card-info {
      padding: 1.8rem 2rem;
      gap: 1rem;
    }
    .card-title { font-size: 2rem; }
    .card-meta { font-size: 1.35rem; }
    .card-overview { font-size: 1.4rem; }
  }

  @container (min-width: 720px) {
    .card {
      grid-template-columns: minmax(24rem, 36rem) 1fr;
      grid-template-rows: 1fr;
      min-height: 28rem;
    }

    .card-image {
      height: 100%;
      aspect-ratio: auto;
    }

    .card-info {
      padding: 2.2rem 2.4rem;
      justify-content: flex-start;
      overflow: hidden;
    }

    .card-title { font-size: 2.4rem; }
  }

  @container (min-width: 1100px) {
    .card {
      grid-template-columns: minmax(30rem, 40rem) 1fr;
      min-height: 32rem;
    }
    .card-info { padding: 2.8rem 3.2rem; }
    .card-title { font-size: 2.8rem; }
    .card-overview { font-size: 1.5rem; }
  }

  /* Compact mode — used when card is one cell in a multi-column grid.
     Caps content so every card in a row settles to the same height. */
  :host([compact]) {
    height: 100%;
  }

  :host([compact]) .card {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    min-height: 0;
    height: 100%;
  }

  :host([compact]) .card-image {
    aspect-ratio: 16 / 9;
    height: auto;
  }

  :host([compact]) .card-info {
    padding: 1.3rem 1.5rem 1.5rem;
    gap: 0.6rem;
  }

  :host([compact]) .card-title {
    font-size: 1.55rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  :host([compact]) .card-meta { font-size: 1.2rem; }

  :host([compact]) .card-overview {
    font-size: 1.3rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  :host([compact]) .card-genres {
    /* One row of pills only; clip any overflow */
    max-height: 2.6rem;
    overflow: hidden;
    flex-wrap: nowrap;
  }

  :host([compact]) .card-genre {
    font-size: 1.1rem;
    padding: 0.25rem 0.7rem;
    white-space: nowrap;
  }

  /* Metadata bar (runtime, status, budget, etc) */
  .card-metadata-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.2rem;
  }

  .meta-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 1.15rem;
    color: var(--text-muted);
    background: var(--bg-elevated);
    padding: 0.3rem 0.7rem;
    border-radius: var(--radius-pill);
    border: 1px solid var(--border);
  }

  /* Tagline */
  .card-tagline {
    margin: 0.2rem 0 0;
    font-style: italic;
    color: var(--text-dim);
    font-size: 1.25rem;
    line-height: 1.5;
  }

  /* Homepage link */
  .card-homepage-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 1.25rem;
    color: var(--accent);
    text-decoration: none;
    transition: color var(--fast);
  }

  .card-homepage-link:hover {
    color: var(--accent-hover);
  }

  /* Production info */
  .card-production {
    margin: 0;
    font-size: 1.2rem;
    color: var(--text-dim);
    line-height: 1.5;
  }

  /* Collection link */
  .card-collection-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 1.25rem;
    color: var(--accent);
    text-decoration: none;
    transition: color var(--fast);
  }

  .card-collection-link:hover {
    color: var(--accent-hover);
  }
`);

export default sheet;
