class MoviePoster extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const template = document.getElementById('movie-poster');
    const clone = template.content.cloneNode(true);

    shadow.appendChild(clone);
  }

  connectedCallback() {
    const { posterPath, rating } = this.dataset;
    const shadow = this.shadowRoot;

    // Update source URLs
    const cardImage = shadow.querySelector('.card__image');
    cardImage.setAttribute('src', cardImage.getAttribute('src') + posterPath);
    const sources = shadow.querySelectorAll('.js-picture-source');
    for (const source of sources) {
      source.setAttribute('srcset', source.getAttribute('srcset') + posterPath);
    }

    // Update rating
    shadow.querySelector('.card__rating').textContent = rating;
  }
}

customElements.define('movie-poster', MoviePoster);
