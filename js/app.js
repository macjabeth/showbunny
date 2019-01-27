import TMDB from './tmdb.js';
import Spider from './spider.js';

class App {
  constructor () {
    this.tmdb = new TMDB();
    this.spider = new Spider();

    this.elem = {
      search: document.getElementsByClassName('site-search')[0],
      results: document.getElementsByClassName('search-results')[0],
      dialog: document.getElementsByClassName('result-dialog')[0],
      dex: document.getElementsByClassName('dialog-x')[0]
    };

    this.bindUIElements();
  }

  bindUIElements () {
    const { search, dialog, dex } = this.elem;
    search.addEventListener('submit', event => this.getSearchResults(event));
    dex.addEventListener('click', () => {
      dialog.removeChild(dialog.lastChild);
      dialog.close();
    });
  }

  getSearchResults (event) {
    event.preventDefault();
    this.elem.results.innerHTML = '';
    this.tmdb.search(event.target.children[0].value)
      .then(({ results }) => this.paintSearchResults(results));
  }

  getSearchResult (data) {
    const { media_type, poster_path, name, title, id, release_date, first_air_date } = data;
    const { base_url, poster_sizes } = this.tmdb.config.images;

    let year = release_date || first_air_date; year = typeof year !== 'undefined' ? year.split('-')[0] : year;

    const div = document.createElement('div');
    div.classList.add('result-card');
    div.style.backgroundImage = poster_path
      ? `url('${base_url}original${poster_path}')`
      : `url('img/placeholder.png')`;

    const h3 = document.createElement('h3');
    h3.classList.add('result-title');
    h3.appendChild(document.createTextNode(`${name || title}`));
    if (year) {
      h3.appendChild(document.createElement('br'));
      h3.appendChild(document.createTextNode(`(${year})`));
    }

    div.appendChild(h3);

    const { dialog } = this.elem;
    div.addEventListener('click', (event) => {
      const iframe = media_type === 'movie' ? this.spider.getMovieStream(id) : (() => this.spider.getTVStream(id, prompt('Season?'), prompt('Episode?')))();
      dialog.insertAdjacentHTML('beforeend', iframe);
      dialog.showModal();
    });

    return div;
  }

  paintSearchResults (data) {
    console.log(data);
    const { results } = this.elem;
    data.filter(({ media_type }) => media_type !== 'person').forEach(result => {
      results.appendChild(this.getSearchResult(result));
    });
  }
}

new App();
