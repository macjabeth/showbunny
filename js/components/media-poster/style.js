const sheet = new CSSStyleSheet();

sheet.replaceSync(`
  :host {
    display: block;
  }

  .card-link {
    display: block;
    text-decoration: none;
    color: inherit;
    border-radius: var(--radius-lg);
    outline: none;
  }

  .card-link:focus-visible .card {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .card {
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    background: var(--bg-card);
    transition: transform var(--normal), border-color var(--normal), box-shadow var(--normal);
    aspect-ratio: 2 / 3;
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    background: var(--bg-elevated);
  }

  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      0deg,
      rgba(10, 10, 15, 0.96) 0%,
      rgba(10, 10, 15, 0.75) 35%,
      rgba(10, 10, 15, 0.15) 65%,
      transparent 100%
    );
    display: flex;
    align-items: flex-end;
    pointer-events: none;
  }

  .card-info {
    width: 100%;
    padding: 1rem 1.1rem 1.1rem;
  }

  .card-header {
    margin-bottom: 0.4rem;
  }

  .card-title {
    margin: 0 0 0.35rem;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.01em;
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.15rem;
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
    font-size: 1.05rem;
    line-height: 1;
  }

  .card-overview {
    display: none;
  }

  .card-episode-count {
    font-size: 1.05rem;
    color: var(--accent);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-top: 0.4rem;
  }

  /* Hover-capable devices: subtle lift + scale, plus reveal overview */
  @media (hover: hover) and (pointer: fine) {
    .card {
      cursor: pointer;
    }

    .card-overlay {
      background: linear-gradient(
        0deg,
        rgba(10, 10, 15, 0.92) 0%,
        rgba(10, 10, 15, 0.55) 35%,
        transparent 70%
      );
      transition: background var(--normal);
    }

    .card-link:hover .card,
    .card-link:focus-visible .card {
      transform: translateY(-4px);
      border-color: var(--border-hover);
      box-shadow: var(--shadow-lg), 0 0 30px var(--accent-glow);
    }

    .card-link:hover .card-overlay,
    .card-link:focus-visible .card-overlay {
      background: linear-gradient(
        0deg,
        rgba(10, 10, 15, 0.97) 0%,
        rgba(10, 10, 15, 0.85) 45%,
        rgba(10, 10, 15, 0.2) 80%,
        transparent 100%
      );
    }

    .card-link:hover .card-overview,
    .card-link:focus-visible .card-overview {
      display: -webkit-box;
    }

    .card-overview {
      margin: 0.4rem 0 0;
      color: var(--text-muted);
      line-height: 1.45;
      font-size: 1.2rem;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  @media screen and (min-width: 600px) {
    .card-title { font-size: 1.55rem; }
    .card-meta { font-size: 1.2rem; }
  }

  @media screen and (min-width: 1024px) {
    .card-title { font-size: 1.65rem; }
    .card-info { padding: 1.2rem 1.4rem 1.4rem; }
  }
`);

export default sheet;
