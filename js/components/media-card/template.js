const template = document.createElement('template');

template.innerHTML = `
  <div class="card">
    <img
      class="card-image"
      alt="Poster Image"
      src="https://image.tmdb.org/t/p/w780"
    />
    <div class="card-info">
      <div class="card-header">
        <h2 class="card-title"></h2>
        <div class="card-meta">
          <span class="card-year"></span>
          <span class="card-rating"></span>
        </div>
      </div>
      <p class="card-overview"></p>
      <ul class="card-genres"></ul>
    </div>
  </div>
`;

export default template;
