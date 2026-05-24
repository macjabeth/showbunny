const sheet = new CSSStyleSheet();

sheet.replaceSync(`
  .card {
    color: var(--text);
    flex-shrink: 0;
    position: relative;
    width: 154px;
    border-radius: 0.6rem;
    overflow: hidden;
    cursor: pointer;
    transition: transform var(--normal), box-shadow var(--normal);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }

  .card:hover {
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 8px 30px rgba(245, 166, 35, 0.2);
  }

  .card-image {
    border-radius: 0.4rem;
    display: block;
    max-width: 100%;
    height: auto;
    transition: filter var(--normal);
  }

  .card:hover .card-image {
    filter: brightness(1.1);
  }

  .badge {
    position: absolute;
    background: rgba(10, 10, 15, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 0.5rem;
    font-size: 1.1rem;
    padding: 0.3rem 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    font-weight: 500;
    z-index: 2;
  }

  .card-rating {
    left: 5px;
    top: 5px;
  }

  .card-rating::before {
    content: '🐰';
    margin-right: 2px;
  }

  .card-episode-count {
    right: 5px;
    top: 5px;
  }

  .card-episode-count::before {
    content: '🥕';
    margin-right: 2px;
  }

  a {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  @media screen and (min-width: 600px) {
    .card {
      width: 185px;
    }
  }

  @media screen and (min-width: 1024px) {
    .card {
      width: 220px;
    }

    .badge {
      font-size: 1.2rem;
      padding: 0.35rem 0.6rem;
    }
  }

  @media screen and (min-width: 2560px) {
    .card {
      width: 340px;
    }
  }
`);

export default sheet;
