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
      loadMoreTVBase: document.querySelector('.load-more-tv-base'),
      // Home page sections
      nowPlayingCards: document.querySelector('#popular .now-playing-cards'),
      upcomingCards: document.querySelector('#popular .upcoming-cards'),
      topRatedMoviesCards: document.querySelector('#popular .top-rated-movies-cards'),
      topRatedTVCards: document.querySelector('#popular .top-rated-tv-cards'),
      // Search
      searchInput: document.getElementById('search-input'),
      searchResults: document.querySelector('#search-page .search-results'),
      searchToggleBtns: document.querySelectorAll('.search-type-toggle .toggle-btn'),
      loadMoreSearch: document.querySelector('.load-more-search'),
      // Person
      personDetails: document.querySelector('#person-page .person-details'),
      // Collection
      collectionDetails: document.querySelector('#collection-page .collection-details'),
    };

    this.state = {
      moviePageNum: 1,
      tvPageNum: 1,
      episodesPageNum: 1,
      moviesBase: { pageNum: 1, sort_field: 'popularity', order: 'desc', with_genres: '' },
      tvBase: { pageNum: 1, sort_field: 'popularity', order: 'desc', with_genres: '' },
      search: { query: '', type: 'movie', pageNum: 1 },
    };

    this.elements.loadMoreMovies?.addEventListener('click', () => this.loadMoreMovies());
    this.elements.loadMoreShows?.addEventListener('click', () => this.loadMoreShows());
    this.elements.loadMoreEpisodes?.addEventListener('click', () => this.loadMoreEpisodes());
    this.elements.loadMoreMoviesBase?.addEventListener('click', () => this.loadMoreMoviesBase());
    this.elements.loadMoreTVBase?.addEventListener('click', () => this.loadMoreTVBase());
    this.elements.loadMoreSearch?.addEventListener('click', () => this.loadMoreSearch());

    this.elements.moviesSortField?.addEventListener('change', () => this.onMoviesFilterChange());
    this.elements.moviesOrder?.addEventListener('change', () => this.onMoviesFilterChange());
    this.elements.moviesGenre?.addEventListener('change', () => this.onMoviesFilterChange());
    this.elements.tvSortField?.addEventListener('change', () => this.onTVFilterChange());
    this.elements.tvOrder?.addEventListener('change', () => this.onTVFilterChange());
    this.elements.tvGenre?.addEventListener('change', () => this.onTVFilterChange());

    // Search controls
    this.initSearchListeners();
  }

  initSearchListeners() {
    if (!this.elements.searchInput) return;

    let debounceTimer;
    this.elements.searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.state.search.query = e.target.value.trim();
        this.state.search.pageNum = 1;
        this.performSearch();
      }, 400);
    });

    this.elements.searchToggleBtns?.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.elements.searchToggleBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.search.type = btn.dataset.type;
        this.state.search.pageNum = 1;
        this.performSearch();
      });
    });
  }

  initSearch() {
    if (this.elements.searchInput && this.elements.searchInput.value) {
      this.state.search.query = this.elements.searchInput.value.trim();
      this.performSearch();
    }
  }

  async meow() {
    this.paintPopularMovies();
    this.paintPopularShows();
    this.paintNowPlaying();
    this.paintUpcoming();
    this.paintTopRatedMovies();
    this.paintTopRatedTV();
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

    this.createSkeletons(detailsWrap, 1);

    const [movie, credits, videos, similar, recommendations, keywords, externalIds] = await Promise.all([
      BunnyChan.fetchMovieDetails(movieId),
      BunnyChan.fetchMovieCredits(movieId).catch(() => ({ cast: [] })),
      BunnyChan.fetchMovieVideos(movieId).catch(() => ({ results: [] })),
      BunnyChan.fetchMovieSimilar(movieId).catch(() => ({ results: [] })),
      BunnyChan.fetchMovieRecommendations(movieId).catch(() => ({ results: [] })),
      BunnyChan.fetchMovieKeywords(movieId).catch(() => ({ keywords: [] })),
      BunnyChan.fetchMovieExternalIds(movieId).catch(() => ({})),
    ]);

    removeAllChildNodes(detailsWrap);

    const mediaCard = document.createElement('media-card');
    const shadow = mediaCard.shadowRoot;
    this.fillDetailCard(shadow, {
      title: movie.title,
      year: yearOf(movie.release_date),
      rating: movie.vote_average,
      overview: movie.overview,
      backdrop: movie.backdrop_path || movie.poster_path,
      genres: movie.genres
    });

    // Enriched metadata
    const infoContainer = shadow.querySelector('.card-info');
    infoContainer.appendChild(this.buildMetadataBar([
      { icon: '⏱️', label: this.formatRuntime(movie.runtime), visible: !!movie.runtime },
      { icon: '📊', label: movie.status || '', visible: !!movie.status },
      { icon: '💰', label: this.formatCurrency(movie.budget), visible: !!movie.budget },
      { icon: '💵', label: this.formatCurrency(movie.revenue), visible: !!movie.revenue },
    ]));

    if (movie.tagline) {
      const tagline = document.createElement('p');
      tagline.className = 'card-tagline';
      tagline.textContent = `"${movie.tagline}"`;
      infoContainer.appendChild(tagline);
    }
    if (movie.homepage) {
      const homeLink = document.createElement('a');
      homeLink.href = movie.homepage;
      homeLink.target = '_blank';
      homeLink.rel = 'noopener noreferrer';
      homeLink.className = 'card-homepage-link';
      homeLink.textContent = '🌐 Official Site';
      infoContainer.appendChild(homeLink);
    }
    if (movie.production_companies?.length) {
      const companies = movie.production_companies.map((c) => c.name).join(', ');
      const prodInfo = document.createElement('p');
      prodInfo.className = 'card-production';
      prodInfo.textContent = `🎞️ ${companies}`;
      infoContainer.appendChild(prodInfo);
    }
    if (movie.belongs_to_collection) {
      const collLink = document.createElement('a');
      collLink.href = `#collection/${movie.belongs_to_collection.id}`;
      collLink.className = 'card-collection-link';
      collLink.textContent = `📦 ${movie.belongs_to_collection.name}`;
      infoContainer.appendChild(collLink);
    }

    detailsWrap.append(mediaCard);

    const trailerSection = this.buildTrailerSection(videos.results);
    if (trailerSection) detailsWrap.append(trailerSection);

    const castSection = this.buildCastSection(credits.cast);
    if (castSection) detailsWrap.append(castSection);

    const keywordsSection = this.buildKeywordsSection(keywords.keywords);
    if (keywordsSection) detailsWrap.append(keywordsSection);

    const similarSection = this.buildRelatedSection('🔀 Similar Movies', similar.results, 'movie');
    if (similarSection) detailsWrap.append(similarSection);

    const recSection = this.buildRelatedSection('💡 Recommended', recommendations.results, 'movie');
    if (recSection) detailsWrap.append(recSection);

    const extSection = this.buildExternalLinksSection(externalIds);
    if (extSection) detailsWrap.append(extSection);
  }

  async paintTVDetails(tvId) {
    if (this.elements.tvFilters) this.elements.tvFilters.style.display = 'none';
    if (this.elements.tvBase) this.elements.tvBase.style.display = 'none';
    if (this.elements.loadMoreTVBase) this.elements.loadMoreTVBase.style.display = 'none';

    const detailsWrap = this.elements.tvDetails || this.elements.tvPage;
    removeAllChildNodes(detailsWrap);
    if (this.elements.tvDetails) this.elements.tvDetails.style.display = 'block';

    this.createSkeletons(detailsWrap, 1);

    const [tv, credits, videos, similar, recommendations, keywords, externalIds] = await Promise.all([
      BunnyChan.fetchTVDetails(tvId),
      BunnyChan.fetchTVCredits(tvId).catch(() => ({ cast: [] })),
      BunnyChan.fetchTVVideos(tvId).catch(() => ({ results: [] })),
      BunnyChan.fetchTVSimilar(tvId).catch(() => ({ results: [] })),
      BunnyChan.fetchTVRecommendations(tvId).catch(() => ({ results: [] })),
      BunnyChan.fetchTVKeywords(tvId).catch(() => ({ keywords: [] })),
      BunnyChan.fetchTVExternalIds(tvId).catch(() => ({})),
    ]);

    removeAllChildNodes(detailsWrap);

    const mediaCard = document.createElement('media-card');
    const shadow = mediaCard.shadowRoot;
    this.fillDetailCard(shadow, {
      title: tv.name,
      year: yearOf(tv.first_air_date),
      rating: tv.vote_average,
      overview: tv.overview,
      backdrop: tv.backdrop_path || tv.poster_path,
      genres: tv.genres,
      episodeCount: tv.number_of_episodes
    });

    const infoContainer = shadow.querySelector('.card-info');
    infoContainer.appendChild(this.buildMetadataBar([
      { icon: '📊', label: tv.status || '', visible: !!tv.status },
      { icon: '📺', label: `${tv.number_of_seasons || 0} seasons`, visible: !!tv.number_of_seasons },
      { icon: '🗓️', label: tv.last_air_date || '', visible: !!tv.last_air_date },
      { icon: '🌐', label: (tv.languages || []).join(', '), visible: !!tv.languages?.length },
    ]));

    if (tv.homepage) {
      const homeLink = document.createElement('a');
      homeLink.href = tv.homepage;
      homeLink.target = '_blank';
      homeLink.rel = 'noopener noreferrer';
      homeLink.className = 'card-homepage-link';
      homeLink.textContent = '🌐 Official Site';
      infoContainer.appendChild(homeLink);
    }
    if (tv.networks?.length) {
      const networks = tv.networks.map((n) => n.name).join(', ');
      const netInfo = document.createElement('p');
      netInfo.className = 'card-production';
      netInfo.textContent = `📡 ${networks}`;
      infoContainer.appendChild(netInfo);
    }

    detailsWrap.append(mediaCard);

    const trailerSection = this.buildTrailerSection(videos.results);
    if (trailerSection) detailsWrap.append(trailerSection);

    const castSection = this.buildCastSection(credits.cast);
    if (castSection) detailsWrap.append(castSection);

    const keywordsSection = this.buildKeywordsSection(keywords.keywords);
    if (keywordsSection) detailsWrap.append(keywordsSection);

    const similarSection = this.buildRelatedSection('🔀 Similar Shows', similar.results, 'tv');
    if (similarSection) detailsWrap.append(similarSection);

    const recSection = this.buildRelatedSection('💡 Recommended', recommendations.results, 'tv');
    if (recSection) detailsWrap.append(recSection);

    const extSection = this.buildExternalLinksSection(externalIds);
    if (extSection) detailsWrap.append(extSection);

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

  /***************************************/
  /*  Home page extra sections           */
  /***************************************/

  async paintNowPlaying() {
    const list = this.elements.nowPlayingCards;
    if (!list || list.children.length > 0) return;
    this.createSkeletons(list, 6);
    const data = await BunnyChan.fetchMoviesInTheatres();
    this.removeSkeletons(list);
    const results = (data.results || []).filter((c) => c.poster_path || c.backdrop_path);
    const frag = document.createDocumentFragment();
    for (const card of results) {
      frag.appendChild(this.buildPosterCard(card, 'movie'));
    }
    list.appendChild(frag);
  }

  async paintUpcoming() {
    const list = this.elements.upcomingCards;
    if (!list || list.children.length > 0) return;
    this.createSkeletons(list, 6);
    const data = await BunnyChan.fetchMoviesUpcoming();
    this.removeSkeletons(list);
    const results = (data.results || []).filter((c) => c.poster_path || c.backdrop_path);
    const frag = document.createDocumentFragment();
    for (const card of results) {
      frag.appendChild(this.buildPosterCard(card, 'movie'));
    }
    list.appendChild(frag);
  }

  async paintTopRatedMovies() {
    const list = this.elements.topRatedMoviesCards;
    if (!list || list.children.length > 0) return;
    this.createSkeletons(list, 6);
    const data = await BunnyChan.fetchTopRated('movie');
    this.removeSkeletons(list);
    const results = (data.results || []).filter((c) => c.poster_path || c.backdrop_path);
    const frag = document.createDocumentFragment();
    for (const card of results) {
      frag.appendChild(this.buildPosterCard(card, 'movie'));
    }
    list.appendChild(frag);
  }

  async paintTopRatedTV() {
    const list = this.elements.topRatedTVCards;
    if (!list || list.children.length > 0) return;
    this.createSkeletons(list, 6);
    const data = await BunnyChan.fetchTopRated('tv');
    this.removeSkeletons(list);
    const results = (data.results || []).filter((c) => c.poster_path || c.backdrop_path);
    const frag = document.createDocumentFragment();
    for (const card of results) {
      frag.appendChild(this.buildPosterCard(card, 'tv'));
    }
    list.appendChild(frag);
  }

  /***************************************/
  /*  Search                             */
  /***************************************/

  async performSearch() {
    const list = this.elements.searchResults;
    const loadMoreBtn = this.elements.loadMoreSearch;
    if (!list) return;
    const query = this.state.search.query;
    if (!query) {
      removeAllChildNodes(list);
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }
    BunnyChan.category = this.state.search.type;
    BunnyChan.page = this.state.search.pageNum;
    BunnyChan.query = query;
    removeAllChildNodes(list);
    this.createSkeletons(list, 8);
    const data = await BunnyChan.fetchData();
    this.removeSkeletons(list);
    const results = (data.results || []).filter((c) => c.poster_path || c.backdrop_path);
    if (results.length === 0) {
      const p = document.createElement('p');
      p.className = 'search-empty';
      p.textContent = 'No results found. Try a different search term.';
      list.appendChild(p);
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }
    const frag = document.createDocumentFragment();
    for (const card of results) {
      frag.appendChild(this.buildPosterCard(card, this.state.search.type));
    }
    list.appendChild(frag);
    if (loadMoreBtn) {
      loadMoreBtn.style.display = data.page < data.total_pages ? '' : 'none';
    }
  }

  loadMoreSearch() {
    this.state.search.pageNum += 1;
    this.performSearch();
  }

  /***************************************/
  /*  Detail helpers                     */
  /***************************************/

  formatRuntime(minutes) {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  formatCurrency(amount) {
    if (!amount) return '';
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount}`;
  }

  buildMetadataBar(items) {
    const bar = document.createElement('div');
    bar.className = 'card-metadata-bar';
    items.forEach(({ icon, label, visible }) => {
      if (!visible) return;
      const span = document.createElement('span');
      span.className = 'meta-badge';
      span.textContent = `${icon} ${label}`;
      bar.appendChild(span);
    });
    return bar;
  }

  buildCastSection(cast) {
    if (!cast || cast.length === 0) return null;
    const section = document.createElement('section');
    section.className = 'detail-section';
    const header = document.createElement('h3');
    header.className = 'detail-section-title';
    header.textContent = '🎭 Top Cast';
    section.appendChild(header);
    const grid = document.createElement('div');
    grid.className = 'cast-grid';
    cast.slice(0, 10).forEach((member) => {
      const card = document.createElement('div');
      card.className = 'cast-card';
      if (member.id) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          window.location.hash = `#person/${member.id}`;
        });
      }
      const img = document.createElement('img');
      img.className = 'cast-photo';
      img.src = member.profile_path
        ? `${IMG_BASE}/w185${member.profile_path}`
        : 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 3 4%22%3E%3Crect fill=%22%23181825%22 width=%223%22 height=%224%22/%3E%3C/svg%3E';
      img.alt = member.name;
      img.loading = 'lazy';
      const info = document.createElement('div');
      info.className = 'cast-info';
      const name = document.createElement('span');
      name.className = 'cast-name';
      name.textContent = member.name;
      const character = document.createElement('span');
      character.className = 'cast-character';
      character.textContent = member.character || '';
      info.appendChild(name);
      info.appendChild(character);
      card.appendChild(img);
      card.appendChild(info);
      grid.appendChild(card);
    });
    section.appendChild(grid);
    return section;
  }

  buildRelatedSection(title, results, kind) {
    if (!results || results.length === 0) return null;
    const section = document.createElement('section');
    section.className = 'detail-section';
    const header = document.createElement('h3');
    header.className = 'detail-section-title';
    header.textContent = title;
    section.appendChild(header);
    const list = document.createElement('ul');
    list.className = 'cards related-cards';
    const frag = document.createDocumentFragment();
    results.filter((c) => c.poster_path || c.backdrop_path).forEach((card) => {
      frag.appendChild(this.buildPosterCard(card, kind));
    });
    list.appendChild(frag);
    section.appendChild(list);
    return section;
  }

  buildKeywordsSection(keywords) {
    if (!keywords || keywords.length === 0) return null;
    const section = document.createElement('section');
    section.className = 'detail-section';
    const header = document.createElement('h3');
    header.className = 'detail-section-title';
    header.textContent = '🏷️ Keywords';
    section.appendChild(header);
    const container = document.createElement('div');
    container.className = 'keywords-container';
    keywords.forEach((kw) => {
      const pill = document.createElement('span');
      pill.className = 'keyword-pill';
      pill.textContent = kw.name;
      container.appendChild(pill);
    });
    section.appendChild(container);
    return section;
  }

  buildTrailerSection(videos) {
    if (!videos || videos.length === 0) return null;
    const section = document.createElement('section');
    section.className = 'detail-section';
    const header = document.createElement('h3');
    header.className = 'detail-section-title';
    header.textContent = '🎬 Videos';
    section.appendChild(header);
    const container = document.createElement('div');
    container.className = 'videos-container';
    const trailers = videos.filter((v) => v.site === 'YouTube' && v.type === 'Trailer');
    const teasers = videos.filter((v) => v.site === 'YouTube' && v.type === 'Teaser');
    const featured = trailers.length > 0 ? trailers : teasers;
    const toShow = featured.length > 0 ? featured.slice(0, 3) : videos.filter((v) => v.site === 'YouTube').slice(0, 3);
    toShow.forEach((video) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'video-wrapper';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${video.key}`;
      iframe.title = video.name;
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      wrapper.appendChild(iframe);
      container.appendChild(wrapper);
    });
    section.appendChild(container);
    return section;
  }

  buildExternalLinksSection(externalIds) {
    if (!externalIds) return null;
    const links = [];
    if (externalIds.imdb_id) links.push({ url: `https://www.imdb.com/title/${externalIds.imdb_id}`, label: 'IMDb', icon: '🎬' });
    if (externalIds.facebook_id) links.push({ url: `https://www.facebook.com/${externalIds.facebook_id}`, label: 'Facebook', icon: '📘' });
    if (externalIds.instagram_id) links.push({ url: `https://www.instagram.com/${externalIds.instagram_id}/`, label: 'Instagram', icon: '📸' });
    if (externalIds.twitter_id) links.push({ url: `https://twitter.com/${externalIds.twitter_id}`, label: 'Twitter', icon: '🐦' });
    if (links.length === 0) return null;
    const section = document.createElement('section');
    section.className = 'detail-section';
    const header = document.createElement('h3');
    header.className = 'detail-section-title';
    header.textContent = '🔗 External Links';
    section.appendChild(header);
    const container = document.createElement('div');
    container.className = 'external-links';
    links.forEach(({ url, label, icon }) => {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'external-link';
      a.textContent = `${icon} ${label}`;
      container.appendChild(a);
    });
    section.appendChild(container);
    return section;
  }

  /***************************************/
  /*  Person page                        */
  /***************************************/

  async paintPersonDetails(personId) {
    const wrap = this.elements.personDetails;
    if (!wrap) return;
    removeAllChildNodes(wrap);
    this.createSkeletons(wrap, 1);
    const [person, movieCredits, tvCredits] = await Promise.all([
      BunnyChan.fetchPersonDetails(personId),
      BunnyChan.fetchPersonMovieCredits(personId).catch(() => ({ cast: [] })),
      BunnyChan.fetchPersonTVCredits(personId).catch(() => ({ cast: [] })),
    ]);
    removeAllChildNodes(wrap);

    const headerCard = document.createElement('div');
    headerCard.className = 'person-header';
    const photo = document.createElement('img');
    photo.className = 'person-photo';
    photo.src = person.profile_path
      ? `${IMG_BASE}/w500${person.profile_path}`
      : 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 2 3%22%3E%3Crect fill=%22%23181825%22 width=%222%22 height=%223%22/%3E%3C/svg%3E';
    photo.alt = person.name;
    const info = document.createElement('div');
    info.className = 'person-info';
    const name = document.createElement('h2');
    name.className = 'person-name';
    name.textContent = person.name;
    const knownFor = document.createElement('p');
    knownFor.className = 'person-known-for';
    knownFor.textContent = person.known_for_department || '';
    const metaBar = document.createElement('div');
    metaBar.className = 'card-metadata-bar';
    if (person.birthday) {
      const bd = document.createElement('span');
      bd.className = 'meta-badge';
      bd.textContent = `🎂 ${person.birthday}`;
      metaBar.appendChild(bd);
    }
    if (person.place_of_birth) {
      const pb = document.createElement('span');
      pb.className = 'meta-badge';
      pb.textContent = `📍 ${person.place_of_birth}`;
      metaBar.appendChild(pb);
    }
    if (person.deathday) {
      const dd = document.createElement('span');
      dd.className = 'meta-badge';
      dd.textContent = `✝️ ${person.deathday}`;
      metaBar.appendChild(dd);
    }
    info.appendChild(name);
    info.appendChild(knownFor);
    info.appendChild(metaBar);
    if (person.biography) {
      const bio = document.createElement('p');
      bio.className = 'person-bio';
      bio.textContent = person.biography;
      info.appendChild(bio);
    }
    headerCard.appendChild(photo);
    headerCard.appendChild(info);
    wrap.appendChild(headerCard);

    if (movieCredits.cast?.length) {
      const movies = movieCredits.cast.filter((c) => c.poster_path || c.backdrop_path).slice(0, 10);
      if (movies.length) {
        const section = document.createElement('section');
        section.className = 'detail-section';
        const secHeader = document.createElement('h3');
        secHeader.className = 'detail-section-title';
        secHeader.textContent = '🎬 Movie Credits';
        section.appendChild(secHeader);
        const list = document.createElement('ul');
        list.className = 'cards related-cards';
        const frag = document.createDocumentFragment();
        movies.forEach((card) => frag.appendChild(this.buildPosterCard(card, 'movie')));
        list.appendChild(frag);
        section.appendChild(list);
        wrap.appendChild(section);
      }
    }

    if (tvCredits.cast?.length) {
      const tvs = tvCredits.cast.filter((c) => c.poster_path || c.backdrop_path).slice(0, 10);
      if (tvs.length) {
        const section = document.createElement('section');
        section.className = 'detail-section';
        const secHeader = document.createElement('h3');
        secHeader.className = 'detail-section-title';
        secHeader.textContent = '📺 TV Credits';
        section.appendChild(secHeader);
        const list = document.createElement('ul');
        list.className = 'cards related-cards';
        const frag = document.createDocumentFragment();
        tvs.forEach((card) => frag.appendChild(this.buildPosterCard(card, 'tv')));
        list.appendChild(frag);
        section.appendChild(list);
        wrap.appendChild(section);
      }
    }
  }

  /***************************************/
  /*  Collection page                    */
  /***************************************/

  async paintCollectionDetails(collectionId) {
    const wrap = this.elements.collectionDetails;
    if (!wrap) return;
    removeAllChildNodes(wrap);
    this.createSkeletons(wrap, 1);
    const collection = await BunnyChan.fetchCollection(collectionId);
    removeAllChildNodes(wrap);

    const header = document.createElement('div');
    header.className = 'collection-header';
    if (collection.backdrop_path) {
      const backdrop = document.createElement('img');
      backdrop.className = 'collection-backdrop';
      backdrop.src = `${IMG_BASE}/w780${collection.backdrop_path}`;
      backdrop.alt = collection.name;
      header.appendChild(backdrop);
    }
    const title = document.createElement('h2');
    title.className = 'collection-name';
    title.textContent = collection.name;
    header.appendChild(title);
    if (collection.overview) {
      const overview = document.createElement('p');
      overview.className = 'collection-overview';
      overview.textContent = collection.overview;
      header.appendChild(overview);
    }
    wrap.appendChild(header);

    if (collection.partials?.length) {
      const section = document.createElement('section');
      section.className = 'detail-section';
      const secHeader = document.createElement('h3');
      secHeader.className = 'detail-section-title';
      secHeader.textContent = `📦 ${collection.partials.length} Movies in Collection`;
      section.appendChild(secHeader);
      const list = document.createElement('ul');
      list.className = 'cards related-cards';
      const frag = document.createDocumentFragment();
      collection.partials.filter((c) => c.poster_path || c.backdrop_path).forEach((card) => {
        frag.appendChild(this.buildPosterCard(card, 'movie'));
      });
      list.appendChild(frag);
      section.appendChild(list);
      wrap.appendChild(section);
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
