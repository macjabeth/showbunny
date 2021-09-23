const template = document.createElement('template');

template.innerHTML = `
  <a href="#">
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
      <div class="badge card-rating">0</div>
      <div class="badge card-episode-count">0</div>
    </div>
  </a>
`;

export default template;
