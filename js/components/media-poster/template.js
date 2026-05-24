const template = document.createElement('template');

template.innerHTML = `
  <a href="#" class="card-link">
    <div class="card">
      <picture>
        <source
          class="js-picture-source"
          media="(max-width: 599px)"
          srcset="https://image.tmdb.org/t/p/w342"
        />
        <source
          class="js-picture-source"
          media="(min-width: 600px)"
          srcset="https://image.tmdb.org/t/p/w500"
        />
        <img
          class="card-image"
          src="https://image.tmdb.org/t/p/w500"
          alt="Poster Image"
        />
      </picture>
      <div class="card-overlay">
        <div class="card-info">
          <div class="card-header">
            <h3 class="card-title"></h3>
            <div class="card-meta">
              <span class="card-year"></span>
              <span class="card-rating"></span>
            </div>
          </div>
          <p class="card-overview"></p>
          <div class="card-episode-count"></div>
        </div>
      </div>
    </div>
  </a>
`;

export default template;
