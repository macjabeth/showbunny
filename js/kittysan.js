import BunnyChan from './bunnychan';

/**
 * Remove all child nodes from an element
 * @param {HTMLElement} parent
 */
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/**
 * KittySan
 * This class handles DOM manipulation.
 */

class KittySan {
  constructor() {
    this.elements = {
      popularMovies: document.querySelector('#popular .movie-cards'),
      popularShows: document.querySelector('#popular .show-cards'),
      episodesCards: document.querySelector('#episodes-page .episodes-cards'),
      moviesPage: document.getElementById('movies-page'),
      tvPage: document.getElementById('tv-page'),
      moviesFilters: document.getElementById('movies-filters'),
      tvFilters: document.getElementById('tv-filters'),
      moviesBase: document.querySelector('#movies-page .movies-base-cards'),
      tvBase: document.querySelector('#tv-page .tv-base-cards'),
      moviesDetails: document.querySelector('#movies-page .movies-details'),
      tvDetails: document.querySelector('#tv-page .tv-details'),
      moviesSortField: document.getElementById('movies-sort-field'),
      moviesOrder: document.getElementById('movies-order'),
      moviesGenre: document.getElementById('movies-genre'),
      tvSortField: document.getElementById('tv-sort-field'),
      tvOrder: document.getElementById('tv-order'),
      tvGenre: document.getElementById('tv-genre'),
      loadMoreMovies: document.querySelector('.load-more-movies'),
      loadMoreShows: document.querySelector('.load-more-shows'),
      loadMoreEpisodes: document.querySelector('.load-more-episodes'),
      loadMoreMoviesBase: document.querySelector('.load-more-movies-base'),
      loadMoreTVBase: document.querySelector('.load-more-tv-base')
    };

    this.state = {
      moviePageNum: 1,
      tvPageNum: 1,
      episodesPageNum: 1,
      moviesBase: { pageNum: 1, sort_field: 'popularity', order: 'desc', with_genres: '' },
      tvBase: { pageNum: 1, sort_field: 'popularity', order: 'desc', with_genres: '' }
    };

    this.elements.loadMoreMovies?.addEventListener('click', () => this.loadMoreMovies());
    this.elements.loadMoreShows?.addEventListener('click', () => this.loadMoreShows());
    this.elements.loadMoreEpisodes?.addEventListener('click', () => this.loadMoreEpisodes());
    this.elements.loadMoreMoviesBase?.addEventListener('click', () => this.loadMoreMoviesBase());
    this.elements.loadMoreTVBase?.addEventListener('click', () => this.loadMoreTVBase());

    this.elements.moviesSortField?.addEventListener('change', () => this.onMoviesFilterChange());
    this.elements.moviesOrder?.addEventListener('change', () => this.onMoviesFilterChange());
    this.elements.moviesGenre?.addEventListener('change', () => this.onMoviesFilterChange());
    this.elements.tvSortField?.addEventListener('change', () => this.onTVFilterChange());
    this.elements.tvOrder?.addEventListener('change', () => this.onTVFilterChange());
    this.elements.tvGenre?.addEventListener('change', () => this.onTVFilterChange());

    this.attachHorizontalScroll(this.elements.popularMovies);
    this.attachHorizontalScroll(this.elements.popularShows);
    this.attachHorizontalScroll(this.elements.moviesBase);
    this.attachHorizontalScroll(this.elements.tvBase);
  }

  async meow() {
    this.paintPopularMovies();
    this.paintPopularShows();
  }

  createSkeletons(list, count = 10) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const li = document.createElement('li');
      li.className = 'skeleton';
      frag.appendChild(li);
    }
    list.appendChild(frag);
  }

  removeSkeletons(list) {
    list.querySelectorAll('.skeleton').forEach((node) => node.remove());
  }

  attachHorizontalScroll(list) {
    if (!list) return;
    list.addEventListener(
      'wheel',
      (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        list.scrollLeft += e.deltaY;
      },
      { passive: false }
    );
  }

  async paintPopularMovies({ append = false } = {}) {
    if (!append && this.elements.popularMovies.children.length > 0) return;

    BunnyChan.category = 'movie';
    BunnyChan.page = this.state.moviePageNum;

    this.createSkeletons(this.elements.popularMovies, 10);
    const data = await BunnyChan.fetchTrendingData();
    this.removeSkeletons(this.elements.popularMovies);
    const cards = data.results;

    cards.sort((a, b) => b.vote_average - a.vote_average);

    for (const card of cards) {
      // Create movie poster element
      const listElement = document.createElement('li');
      const moviePoster = document.createElement('media-poster');
      const shadow = moviePoster.shadowRoot;

      // Update source URLs
      const cardImage = shadow.querySelector('.card-image');
      cardImage.setAttribute('src', cardImage.getAttribute('src') + card.poster_path);
      const sources = shadow.querySelectorAll('.js-picture-source');
      for (const source of sources) {
        source.setAttribute('srcset', source.getAttribute('srcset') + card.poster_path);
      }

      // Update rating
      shadow.querySelector('.card-rating').textContent = card.vote_average.toFixed(1);

      // Update episode count
      shadow.querySelector('.card-episode-count').style.display = 'none';

      // Update route path
      shadow.querySelector('a').href = `#movies/${card.id}`;

      listElement.append(moviePoster);
      listElement.ariaLabel = card.title;

      // Append to the DOM
      this.elements.popularMovies.append(listElement);
    }
  }

  async paintPopularShows({ append = false } = {}) {
    if (!append && this.elements.popularShows.children.length > 0) return;

    BunnyChan.category = 'tv';
    BunnyChan.page = this.state.tvPageNum;

    this.createSkeletons(this.elements.popularShows, 10);
    const data = await BunnyChan.fetchTrendingData();
    this.removeSkeletons(this.elements.popularShows);
    const cards = data.results;

    cards.sort((a, b) => b.vote_average - a.vote_average);

    for (const card of cards) {
      // Create movie poster element
      const listElement = document.createElement('li');
      const tvPoster = document.createElement('media-poster');
      const shadow = tvPoster.shadowRoot;

      // Update source URLs
      const cardImage = shadow.querySelector('.card-image');
      cardImage.setAttribute('src', cardImage.getAttribute('src') + card.poster_path);
      const sources = shadow.querySelectorAll('.js-picture-source');
      for (const source of sources) {
        source.setAttribute('srcset', source.getAttribute('srcset') + card.poster_path);
      }

      // Update rating
      shadow.querySelector('.card-rating').textContent = card.vote_average.toFixed(1);

      // Grab TV episode count
      const details = await BunnyChan.fetchTVDetails(card.id);

      // Update episode count
      const cardEpisodeCount = shadow.querySelector('.card-episode-count');
      cardEpisodeCount.textContent = `${details.number_of_episodes} EP`;

      // Update route path
      shadow.querySelector('a').href = `#tv/${card.id}`;

      listElement.append(tvPoster);
      listElement.ariaLabel = card.name;

      // Append to the DOM
      this.elements.popularShows.append(listElement);
    }
  }

  async paintMovieDetails(movieId) {
    if (this.elements.moviesFilters) this.elements.moviesFilters.style.display = 'none';
    if (this.elements.moviesBase) this.elements.moviesBase.style.display = 'none';
    if (this.elements.loadMoreMoviesBase) this.elements.loadMoreMoviesBase.style.display = 'none';
    const detailsWrap = this.elements.moviesDetails || this.elements.moviesPage;
    removeAllChildNodes(detailsWrap);
    if (this.elements.moviesDetails) this.elements.moviesDetails.style.display = 'block';

    console.log({ movieId });
    const movieDetails = await BunnyChan.fetchMovieDetails(movieId);
    console.log({ movieDetails });
    const mediaCard = document.createElement('media-card');
    const shadow = mediaCard.shadowRoot;

    const backdrop = movieDetails.backdrop_path || movieDetails.poster_path || '';
    if (backdrop) {
      shadow.querySelector('.card-image').src += backdrop;
    }
    shadow.querySelector('.card-title').textContent = movieDetails.title || '';
    const releaseYear = movieDetails.release_date ? String(movieDetails.release_date).split('-')[0] : '';
    shadow.querySelector('.card-year').textContent = releaseYear;
    if (typeof movieDetails.vote_average === 'number') {
      shadow.querySelector('.card-rating').textContent = movieDetails.vote_average.toFixed(1);
    }
    shadow.querySelector('.card-overview').textContent = movieDetails.overview || '';

    const cardGenres = shadow.querySelector('.card-genres');
    movieDetails.genres.forEach((genre) => {
      const listItem = document.createElement('li');
      listItem.className = 'card-genre';
      listItem.textContent = genre.name;
      cardGenres.append(listItem);
    });

    (this.elements.moviesDetails || this.elements.moviesPage).append(mediaCard);
  }

  async paintTVDetails(tvId) {
    if (this.elements.tvFilters) this.elements.tvFilters.style.display = 'none';
    if (this.elements.tvBase) this.elements.tvBase.style.display = 'none';
    if (this.elements.loadMoreTVBase) this.elements.loadMoreTVBase.style.display = 'none';
    const tvWrap = this.elements.tvDetails || this.elements.tvPage;
    removeAllChildNodes(tvWrap);
    if (this.elements.tvDetails) this.elements.tvDetails.style.display = 'block';

    console.log({ tvId });
    const tvDetails = await BunnyChan.fetchTVDetails(tvId);
    console.log({ tvDetails });
    const mediaCard = document.createElement('media-card');
    const shadow = mediaCard.shadowRoot;

    const backdrop = tvDetails.backdrop_path || tvDetails.poster_path || '';
    if (backdrop) {
      shadow.querySelector('.card-image').src += backdrop;
    }
    shadow.querySelector('.card-title').textContent = tvDetails.name || '';
    const firstAirYear = tvDetails.first_air_date ? String(tvDetails.first_air_date).split('-')[0] : '';
    shadow.querySelector('.card-year').textContent = firstAirYear;
    if (typeof tvDetails.vote_average === 'number') {
      shadow.querySelector('.card-rating').textContent = tvDetails.vote_average.toFixed(1);
    }
    shadow.querySelector('.card-overview').textContent = tvDetails.overview || '';

    const cardGenres = shadow.querySelector('.card-genres');
    tvDetails.genres.forEach((genre) => {
      const listItem = document.createElement('li');
      listItem.className = 'card-genre';
      listItem.textContent = genre.name;
      cardGenres.append(listItem);
    });

    (this.elements.tvDetails || this.elements.tvPage).append(mediaCard);

    const episodesSection = document.createElement('section');
    episodesSection.className = 'tv-episodes';
    const controls = document.createElement('div');
    controls.className = 'controls';
    const label = document.createElement('label');
    label.textContent = 'Season ';
    const seasonSelect = document.createElement('select');

    const seasons = (tvDetails.seasons || []).filter((s) => s.season_number !== 0);
    seasons.forEach((s) => {
      const opt = document.createElement('option');
      opt.value = String(s.season_number);
      opt.textContent = s.name || `Season ${s.season_number}`;
      seasonSelect.append(opt);
    });

    label.append(seasonSelect);
    controls.append(label);
    const epList = document.createElement('ul');
    epList.className = 'cards episodes-cards';

    episodesSection.append(controls, epList);
    (this.elements.tvDetails || this.elements.tvPage).append(episodesSection);

    const renderSeason = async (seasonNum) => {
      removeAllChildNodes(epList);
      this.createSkeletons(epList, 6);
      const season = await BunnyChan.fetchTVSeason(tvId, seasonNum);
      this.removeSkeletons(epList);
      (season.episodes || []).forEach((e) => {
        const li = document.createElement('li');
        const card = document.createElement('media-card');
        const sh = card.shadowRoot;
        if (e.still_path) sh.querySelector('.card-image').src += e.still_path;
        sh.querySelector('.card-title').textContent = `${tvDetails.name} - ${e.name}`;
        const year = e.air_date ? String(e.air_date).split('-')[0] : '';
        sh.querySelector('.card-year').textContent = year;
        sh.querySelector('.card-rating').textContent = (e.vote_average || 0).toFixed(1);
        sh.querySelector('.card-overview').textContent = e.overview || '';
        li.append(card);
        epList.append(li);
      });
    };

    if (seasons.length > 0) {
      await renderSeason(seasons[0].season_number);
    }
    seasonSelect.addEventListener('change', () => renderSeason(Number(seasonSelect.value)));
  }

  loadMoreMovies() {
    this.state.moviePageNum += 1;
    this.paintPopularMovies({ append: true });
  }

  loadMoreShows() {
    this.state.tvPageNum += 1;
    this.paintPopularShows({ append: true });
  }

  async paintMoviesBase({ append = false } = {}) {
    const list = this.elements.moviesBase;
    if (!list) return;
    this.elements.moviesFilters && (this.elements.moviesFilters.style.display = 'flex');
    list.style.display = '';
    this.elements.loadMoreMoviesBase && (this.elements.loadMoreMoviesBase.style.display = 'inline-block');
    if (this.elements.moviesDetails) this.elements.moviesDetails.style.display = 'none';

    if (!append) removeAllChildNodes(list);

    if (this.elements.moviesSortField && this.elements.moviesSortField.options.length === 0) {
      const movieSortFields = [
        { value: 'popularity', label: 'Popularity' },
        { value: 'vote_average', label: 'Rating' },
        { value: 'release_date', label: 'Release Date' }
      ];
      movieSortFields.forEach((opt) => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.label;
        this.elements.moviesSortField.append(o);
      });
    }
    if (this.elements.moviesGenre && this.elements.moviesGenre.options.length <= 1) {
      const genres = BunnyChan.movie_genres.length ? BunnyChan.movie_genres : (await BunnyChan.fetchMovieGenres()).genres;
      genres.forEach((g) => {
        const opt = document.createElement('option');
        opt.value = String(g.id);
        opt.textContent = g.name;
        this.elements.moviesGenre.append(opt);
      });
    }

    this.createSkeletons(list, 10);
    const { pageNum, sort_field, order, with_genres } = this.state.moviesBase;
    const sort_by = `${sort_field}.${order}`;
    const data = await BunnyChan.fetchDiscoverMovie({ page: pageNum, sort_by, with_genres });
    this.removeSkeletons(list);

    for (const card of (data.results || [])) {
      if (!card.poster_path && !card.backdrop_path) continue;
      const li = document.createElement('li');
      const poster = document.createElement('media-poster');
      const shadow = poster.shadowRoot;

      const cardImage = shadow.querySelector('.card-image');
      const imgBase = cardImage.getAttribute('src');
      const path = card.poster_path || card.backdrop_path;
      cardImage.setAttribute('src', imgBase + path);
      const sources = shadow.querySelectorAll('.js-picture-source');
      sources.forEach((s) => s.setAttribute('srcset', s.getAttribute('srcset') + path));

      shadow.querySelector('.card-rating').textContent = (card.vote_average || 0).toFixed(1);
      shadow.querySelector('.card-episode-count').style.display = 'none';
      shadow.querySelector('a').href = `#movies/${card.id}`;

      li.append(poster);
      li.ariaLabel = card.title || '';
      list.append(li);
    }
  }

  loadMoreMoviesBase() {
    this.state.moviesBase.pageNum += 1;
    this.paintMoviesBase({ append: true });
  }

  onMoviesFilterChange() {
    this.state.moviesBase.pageNum = 1;
    this.state.moviesBase.sort_field = this.elements.moviesSortField?.value || 'popularity';
    this.state.moviesBase.order = this.elements.moviesOrder?.value || 'desc';
    this.state.moviesBase.with_genres = this.elements.moviesGenre?.value || '';
    this.paintMoviesBase({ append: false });
  }

  async paintTVBase({ append = false } = {}) {
    const list = this.elements.tvBase;
    if (!list) return;
    this.elements.tvFilters && (this.elements.tvFilters.style.display = 'flex');
    list.style.display = '';
    this.elements.loadMoreTVBase && (this.elements.loadMoreTVBase.style.display = 'inline-block');
    if (this.elements.tvDetails) this.elements.tvDetails.style.display = 'none';

    if (!append) removeAllChildNodes(list);

    if (this.elements.tvSortField && this.elements.tvSortField.options.length === 0) {
      const tvSortFields = [
        { value: 'popularity', label: 'Popularity' },
        { value: 'vote_average', label: 'Rating' },
        { value: 'first_air_date', label: 'First Air Date' }
      ];
      tvSortFields.forEach((opt) => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.label;
        this.elements.tvSortField.append(o);
      });
    }
    if (this.elements.tvGenre && this.elements.tvGenre.options.length <= 1) {
      const genres = BunnyChan.tv_genres.length ? BunnyChan.tv_genres : (await BunnyChan.fetchTVGenres()).genres;
      genres.forEach((g) => {
        const opt = document.createElement('option');
        opt.value = String(g.id);
        opt.textContent = g.name;
        this.elements.tvGenre.append(opt);
      });
    }

    this.createSkeletons(list, 10);
    const { pageNum, sort_field, order, with_genres } = this.state.tvBase;
    const sort_by = `${sort_field}.${order}`;
    const data = await BunnyChan.fetchDiscoverTV({ page: pageNum, sort_by, with_genres });
    this.removeSkeletons(list);

    for (const card of (data.results || [])) {
      if (!card.poster_path && !card.backdrop_path) continue;
      const li = document.createElement('li');
      const poster = document.createElement('media-poster');
      const shadow = poster.shadowRoot;
      const cardImage = shadow.querySelector('.card-image');
      const imgBase = cardImage.getAttribute('src');
      const path = card.poster_path || card.backdrop_path;
      cardImage.setAttribute('src', imgBase + path);
      const sources = shadow.querySelectorAll('.js-picture-source');
      sources.forEach((s) => s.setAttribute('srcset', s.getAttribute('srcset') + path));

      shadow.querySelector('.card-rating').textContent = (card.vote_average || 0).toFixed(1);
      shadow.querySelector('.card-episode-count').style.display = 'none';
      shadow.querySelector('a').href = `#tv/${card.id}`;
      li.append(poster);
      li.ariaLabel = card.name || '';
      list.append(li);
    }
  }

  loadMoreTVBase() {
    this.state.tvBase.pageNum += 1;
    this.paintTVBase({ append: true });
  }

  onTVFilterChange() {
    this.state.tvBase.pageNum = 1;
    this.state.tvBase.sort_field = this.elements.tvSortField?.value || 'popularity';
    this.state.tvBase.order = this.elements.tvOrder?.value || 'desc';
    this.state.tvBase.with_genres = this.elements.tvGenre?.value || '';
    this.paintTVBase({ append: false });
  }

  async paintEpisodes({ append = false } = {}) {
    const list = this.elements.episodesCards;
    if (!list) return;
    if (!append && list.children.length > 0) return;

    this.createSkeletons(list, 6);
    const data = await BunnyChan.fetchTVOnTheAir(this.state.episodesPageNum);
    this.removeSkeletons(list);

    const shows = data.results || [];

    for (const show of shows) {
      const details = await BunnyChan.fetchTVDetails(show.id);
      const ep = details.next_episode_to_air || details.last_episode_to_air;
      if (!ep) continue;

      const item = document.createElement('li');
      const mediaCard = document.createElement('media-card');
      const shadow = mediaCard.shadowRoot;

      shadow.querySelector('.card-image').src += details.backdrop_path || details.poster_path || '';
      shadow.querySelector('.card-title').textContent = `${details.name} - S${String(ep.season_number).padStart(2, '0')}E${String(ep.episode_number).padStart(2, '0')}`;
      const airYear = (ep.air_date || '').split('-')[0] || '';
      shadow.querySelector('.card-year').textContent = airYear;
      shadow.querySelector('.card-rating').textContent = (details.vote_average || 0).toFixed(1);
      shadow.querySelector('.card-overview').textContent = ep.overview || details.overview || '';

      const cardGenres = shadow.querySelector('.card-genres');
      (details.genres || []).forEach((genre) => {
        const li = document.createElement('li');
        li.className = 'card-genre';
        li.textContent = genre.name;
        cardGenres.append(li);
      });

      item.append(mediaCard);
      item.ariaLabel = `${details.name} ${ep.name}`;
      item.addEventListener('click', () => {
        window.location.hash = `#tv/${show.id}`;
      });
      list.append(item);
    }
  }

  loadMoreEpisodes() {
    this.state.episodesPageNum += 1;
    this.paintEpisodes({ append: true });
  }
}

export default new KittySan();
