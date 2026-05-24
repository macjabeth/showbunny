import BunnyChan from './bunnychan';

const IMG_BASE = 'https://image.tmdb.org/t/p';

const removeAllChildNodes = (parent) => {
  while (parent.firstChild) parent.removeChild(parent.firstChild);
};

const yearOf = (dateStr) => (dateStr ? String(dateStr).split('-')[0] : '');

const truncate = (text, max = 110) => {
  const clean = (text || '').replace(/<[^>]*>/g, '');
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
};

const setPosterImage = (shadow, path) => {
  if (!path) return;
  const img = shadow.querySelector('.card-image');
  img.setAttribute('src', `${IMG_BASE}/w500${path}`);
  shadow.querySelectorAll('.js-picture-source').forEach((source) => {
    const isSmall = source.media?.includes('max-width');
    source.setAttribute('srcset', `${IMG_BASE}/${isSmall ? 'w342' : 'w500'}${path}`);
  });
};

const setBackdropImage = (shadow, path) => {
  if (!path) return;
  shadow.querySelector('.card-image').src = `${IMG_BASE}/w780${path}`;
};

const populateSelect = (selectEl, options, { skipIfPopulated = true, keepFirst = false } = {}) => {
  if (!selectEl) return;
  const threshold = keepFirst ? 1 : 0;
  if (skipIfPopulated && selectEl.options.length > threshold) return;
  for (const { value, label } of options) {
    const opt = document.createElement('option');
    opt.value = String(value);
    opt.textContent = label;
    selectEl.append(opt);
  }
};

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

  buildPosterCard(card, kind) {
    const isMovie = kind === 'movie';
    const title = isMovie ? card.title : card.name;
    const year = yearOf(isMovie ? card.release_date : card.first_air_date);
    const path = card.poster_path || card.backdrop_path;

    const li = document.createElement('li');
    const poster = document.createElement('media-poster');
    const shadow = poster.shadowRoot;

    setPosterImage(shadow, path);
    shadow.querySelector('.card-rating').textContent = (card.vote_average || 0).toFixed(1);
    shadow.querySelector('.card-title').textContent = title || '';
    shadow.querySelector('.card-year').textContent = year;
    shadow.querySelector('.card-overview').textContent = truncate(card.overview);
    shadow.querySelector('.card-episode-count').remove();
    shadow.querySelector('a').href = `#${isMovie ? 'movies' : 'tv'}/${card.id}`;

    li.append(poster);
    li.ariaLabel = title || '';
    return li;
  }

  async renderPosterList(list, fetcher, kind, { append }) {
    if (!list) return;
    if (!append) removeAllChildNodes(list);
    this.createSkeletons(list, 10);
    const data = await fetcher();
    this.removeSkeletons(list);

    const results = (data.results || []).filter((c) => c.poster_path || c.backdrop_path);
    const frag = document.createDocumentFragment();
    for (const card of results) {
      frag.appendChild(this.buildPosterCard(card, kind));
    }
    list.appendChild(frag);
  }

  async paintPopularMovies({ append = false } = {}) {
    const list = this.elements.popularMovies;
    if (!list) return;
    if (!append && list.children.length > 0) return;
    BunnyChan.category = 'movie';
    BunnyChan.page = this.state.moviePageNum;
    await this.renderPosterList(list, () => BunnyChan.fetchTrendingData(), 'movie', { append });
  }

  async paintPopularShows({ append = false } = {}) {
    const list = this.elements.popularShows;
    if (!list) return;
    if (!append && list.children.length > 0) return;
    BunnyChan.category = 'tv';
    BunnyChan.page = this.state.tvPageNum;
    await this.renderPosterList(list, () => BunnyChan.fetchTrendingData(), 'tv', { append });
  }

  async paintMoviesBase({ append = false } = {}) {
    const list = this.elements.moviesBase;
    if (!list) return;
    if (this.elements.moviesFilters) this.elements.moviesFilters.style.display = 'flex';
    list.style.display = '';
    if (this.elements.loadMoreMoviesBase) this.elements.loadMoreMoviesBase.style.display = '';
    if (this.elements.moviesDetails) this.elements.moviesDetails.style.display = 'none';

    populateSelect(this.elements.moviesSortField, [
      { value: 'popularity', label: 'Popularity' },
      { value: 'vote_average', label: 'Rating' },
      { value: 'release_date', label: 'Release Date' }
    ]);

    if (this.elements.moviesGenre && this.elements.moviesGenre.options.length <= 1) {
      const genres = BunnyChan.movie_genres.length
        ? BunnyChan.movie_genres
        : (await BunnyChan.fetchMovieGenres()).genres;
      populateSelect(
        this.elements.moviesGenre,
        genres.map((g) => ({ value: g.id, label: g.name })),
        { skipIfPopulated: false }
      );
    }

    const { pageNum, sort_field, order, with_genres } = this.state.moviesBase;
    await this.renderPosterList(
      list,
      () => BunnyChan.fetchDiscoverMovie({ page: pageNum, sort_by: `${sort_field}.${order}`, with_genres }),
      'movie',
      { append }
    );
  }

  async paintTVBase({ append = false } = {}) {
    const list = this.elements.tvBase;
    if (!list) return;
    if (this.elements.tvFilters) this.elements.tvFilters.style.display = 'flex';
    list.style.display = '';
    if (this.elements.loadMoreTVBase) this.elements.loadMoreTVBase.style.display = '';
    if (this.elements.tvDetails) this.elements.tvDetails.style.display = 'none';

    populateSelect(this.elements.tvSortField, [
      { value: 'popularity', label: 'Popularity' },
      { value: 'vote_average', label: 'Rating' },
      { value: 'first_air_date', label: 'First Air Date' }
    ]);

    if (this.elements.tvGenre && this.elements.tvGenre.options.length <= 1) {
      const genres = BunnyChan.tv_genres.length
        ? BunnyChan.tv_genres
        : (await BunnyChan.fetchTVGenres()).genres;
      populateSelect(
        this.elements.tvGenre,
        genres.map((g) => ({ value: g.id, label: g.name })),
        { skipIfPopulated: false }
      );
    }

    const { pageNum, sort_field, order, with_genres } = this.state.tvBase;
    await this.renderPosterList(
      list,
      () => BunnyChan.fetchDiscoverTV({ page: pageNum, sort_by: `${sort_field}.${order}`, with_genres }),
      'tv',
      { append }
    );
  }

  paintGenres(shadow, genres) {
    const container = shadow.querySelector('.card-genres');
    if (!container || !genres?.length) return;
    const frag = document.createDocumentFragment();
    genres.forEach((g) => {
      const li = document.createElement('li');
      li.className = 'card-genre';
      li.textContent = g.name;
      frag.appendChild(li);
    });
    container.appendChild(frag);
  }

  fillDetailCard(shadow, { title, year, rating, overview, backdrop, genres, episodeCount }) {
    setBackdropImage(shadow, backdrop);
    shadow.querySelector('.card-title').textContent = title || '';
    shadow.querySelector('.card-year').textContent = year || '';
    const ratingEl = shadow.querySelector('.card-rating');
    if (typeof rating === 'number') ratingEl.textContent = rating.toFixed(1);
    else ratingEl.remove();
    shadow.querySelector('.card-overview').textContent = overview || '';
    const epEl = shadow.querySelector('.card-episode-count');
    if (episodeCount) epEl.textContent = `${episodeCount} EP`;
    else epEl.remove();
    this.paintGenres(shadow, genres);
  }

  async paintMovieDetails(movieId) {
    if (this.elements.moviesFilters) this.elements.moviesFilters.style.display = 'none';
    if (this.elements.moviesBase) this.elements.moviesBase.style.display = 'none';
    if (this.elements.loadMoreMoviesBase) this.elements.loadMoreMoviesBase.style.display = 'none';

    const detailsWrap = this.elements.moviesDetails || this.elements.moviesPage;
    removeAllChildNodes(detailsWrap);
    if (this.elements.moviesDetails) this.elements.moviesDetails.style.display = 'block';

    const movie = await BunnyChan.fetchMovieDetails(movieId);
    const mediaCard = document.createElement('media-card');
    this.fillDetailCard(mediaCard.shadowRoot, {
      title: movie.title,
      year: yearOf(movie.release_date),
      rating: movie.vote_average,
      overview: movie.overview,
      backdrop: movie.backdrop_path || movie.poster_path,
      genres: movie.genres
    });
    detailsWrap.append(mediaCard);
  }

  async paintTVDetails(tvId) {
    if (this.elements.tvFilters) this.elements.tvFilters.style.display = 'none';
    if (this.elements.tvBase) this.elements.tvBase.style.display = 'none';
    if (this.elements.loadMoreTVBase) this.elements.loadMoreTVBase.style.display = 'none';

    const detailsWrap = this.elements.tvDetails || this.elements.tvPage;
    removeAllChildNodes(detailsWrap);
    if (this.elements.tvDetails) this.elements.tvDetails.style.display = 'block';

    const tv = await BunnyChan.fetchTVDetails(tvId);
    const mediaCard = document.createElement('media-card');
    this.fillDetailCard(mediaCard.shadowRoot, {
      title: tv.name,
      year: yearOf(tv.first_air_date),
      rating: tv.vote_average,
      overview: tv.overview,
      backdrop: tv.backdrop_path || tv.poster_path,
      genres: tv.genres,
      episodeCount: tv.number_of_episodes
    });
    detailsWrap.append(mediaCard);

    const episodesSection = this.buildEpisodesSection(tv, tvId);
    detailsWrap.append(episodesSection);
  }

  buildEpisodesSection(tv, tvId) {
    const section = document.createElement('section');
    section.className = 'tv-episodes';

    const controls = document.createElement('div');
    controls.className = 'controls';

    const label = document.createElement('label');
    label.textContent = '🥕 Season ';
    const seasonSelect = document.createElement('select');

    const seasons = (tv.seasons || []).filter((s) => s.season_number !== 0);
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
    section.append(controls, epList);

    const renderSeason = async (seasonNum) => {
      removeAllChildNodes(epList);
      this.createSkeletons(epList, 6);
      const season = await BunnyChan.fetchTVSeason(tvId, seasonNum);
      this.removeSkeletons(epList);
      const frag = document.createDocumentFragment();
      (season.episodes || []).forEach((e) => {
        const li = document.createElement('li');
        const card = document.createElement('media-card');
        card.setAttribute('compact', '');
        this.fillDetailCard(card.shadowRoot, {
          title: e.name || `Episode ${e.episode_number}`,
          year: yearOf(e.air_date),
          rating: e.vote_average,
          overview: e.overview,
          backdrop: e.still_path
        });
        li.append(card);
        frag.append(li);
      });
      epList.appendChild(frag);
    };

    if (seasons.length > 0) {
      renderSeason(seasons[0].season_number);
    }
    seasonSelect.addEventListener('change', () => renderSeason(Number(seasonSelect.value)));

    return section;
  }

  async paintEpisodes({ append = false } = {}) {
    const list = this.elements.episodesCards;
    if (!list) return;
    if (!append && list.children.length > 0) return;

    if (!append) removeAllChildNodes(list);
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
      mediaCard.setAttribute('compact', '');
      const seasonLabel = `S${String(ep.season_number).padStart(2, '0')}E${String(ep.episode_number).padStart(2, '0')}`;

      this.fillDetailCard(mediaCard.shadowRoot, {
        title: `${details.name} · ${seasonLabel}`,
        year: yearOf(ep.air_date),
        rating: details.vote_average,
        overview: ep.overview || details.overview,
        backdrop: details.backdrop_path || details.poster_path,
        genres: details.genres
      });

      item.append(mediaCard);
      item.ariaLabel = `${details.name} ${ep.name}`;
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        window.location.hash = `#tv/${show.id}`;
      });
      list.append(item);
    }
  }

  loadMoreMovies() {
    this.state.moviePageNum += 1;
    this.paintPopularMovies({ append: true });
  }

  loadMoreShows() {
    this.state.tvPageNum += 1;
    this.paintPopularShows({ append: true });
  }

  loadMoreMoviesBase() {
    this.state.moviesBase.pageNum += 1;
    this.paintMoviesBase({ append: true });
  }

  loadMoreTVBase() {
    this.state.tvBase.pageNum += 1;
    this.paintTVBase({ append: true });
  }

  loadMoreEpisodes() {
    this.state.episodesPageNum += 1;
    this.paintEpisodes({ append: true });
  }

  onMoviesFilterChange() {
    this.state.moviesBase.pageNum = 1;
    this.state.moviesBase.sort_field = this.elements.moviesSortField?.value || 'popularity';
    this.state.moviesBase.order = this.elements.moviesOrder?.value || 'desc';
    this.state.moviesBase.with_genres = this.elements.moviesGenre?.value || '';
    this.paintMoviesBase({ append: false });
  }

  onTVFilterChange() {
    this.state.tvBase.pageNum = 1;
    this.state.tvBase.sort_field = this.elements.tvSortField?.value || 'popularity';
    this.state.tvBase.order = this.elements.tvOrder?.value || 'desc';
    this.state.tvBase.with_genres = this.elements.tvGenre?.value || '';
    this.paintTVBase({ append: false });
  }
}

export default new KittySan();
