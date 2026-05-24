const sheet = new CSSStyleSheet();

sheet.replaceSync(`
  .card {
    padding: 0;
    display: grid;
    grid-auto-flow: row;
    background-color: var(--bg-card);
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
    transition: all var(--normal);
  }

  .card:hover {
    border-color: var(--border-hover);
    box-shadow: var(--shadow-lg), 0 0 40px var(--accent-glow);
    transform: translateY(-2px);
  }

  .card-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 0;
    display: block;
  }

  .card-info {
    padding: 2.4rem;
  }

  .card-header {
    margin-bottom: 1.6rem;
  }

  .card-title {
    margin-bottom: 0.8rem;
    font-size: 2.4rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-size: 1.4rem;
    color: var(--text-muted);
  }

  .card-year {
    color: var(--text-muted);
  }

  .card-rating::before {
    content: '🐰';
    margin-right: 4px;
    font-size: 1.3rem;
  }

  .card-overview {
    margin: 1.6rem 0;
    color: var(--text-muted);
    line-height: 1.7;
    font-size: 1.5rem;
  }

  .card-genres {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.8rem;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .card-genre {
    color: var(--accent);
    background-color: var(--accent-soft);
    padding: 0.5rem 1.2rem;
    border-radius: var(--radius-sm);
    font-weight: 500;
    font-size: 1.3rem;
    border: 1px solid rgba(245, 166, 35, 0.15);
    transition: all var(--fast);
  }

  .card-genre:hover {
    background-color: rgba(245, 166, 35, 0.2);
    border-color: rgba(245, 166, 35, 0.3);
  }
`);

export default sheet;
