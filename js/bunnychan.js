/**
 * BunnyChan
 * This class handles API logic for TMDB.
 */

class BunnyChan {
  constructor() {
    this.tmdb_key = import.meta.env.VITE_TMDB_KEY;
    if (!this.tmdb_key) {
      console.warn('VITE_TMDB_KEY is not set. TMDB API requests will fail.');
    }
    this.session_id = '';
    this.query = '';
    this.category = 'movie';
    this.page = 1;
    this.movie_genres = [];
    this.tv_genres = [];
    this.cachedResponse = {};

    // fetch the movie genres
    this.fetchMovieGenres()
      .then((data) => {
        this.movie_genres = data.genres;
      })
      .catch((err) => console.error(err));

    // fetch the tv genres
    this.fetchTVGenres()
      .then((data) => {
        this.tv_genres = data.genres;
      })
      .catch((err) => console.error(err));

    // fetch movies in theatres
    this.fetchMoviesInTheatres()
      .then((data) => {
        this.inTheatres = data;
      })
      .catch((err) => console.error(err));
  }

  /***************************************/
  /* (>^.^>) User Authentication (<^.^<) */
  /***************************************/

  async getRequestToken() {
    const data = await fetch(
      `https://api.themoviedb.org/3/authentication/token/new?api_key=${this.tmdb_key}`
    ).then((res) => res.json());
    if (!data.success) throw new Error(`Error creating request token; ${data.status_message}`);
    return data.request_token;
  }

  async createSession() {
    const request_token = await this.getRequestToken();
    // After the user approves the request token in the browser, create a new session
    const data = await fetch(
      `https://api.themoviedb.org/3/authentication/session/new?api_key=${this.tmdb_key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ request_token })
      }
    ).then((res) => res.json());
    if (!data.success) throw new Error(`Error creating session; ${data.status_message}`);
    this.session_id = data.session_id;
    return this.session_id;
  }

  static requestUserPermission(token) {
    window.open(`https://www.themoviedb.org/authenticate/${token}`, '_blank');
  }

  /***************************************/
  /*    (>^.^>) Data Queries (<^.^<)     */
  /***************************************/

  async fetchData() {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/${this.category}?api_key=${this.tmdb_key}&query=${this.query}&page=${this.page}`
    );
    return await response.json();
  }

  async fetchMovieGenres() {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.tmdb_key}&language=en-US`;
    if (import.meta.env && import.meta.env.DEV) console.debug('[TMDB] movie genres request', { url });
    const response = await fetch(url);
    return await response.json();
  }

  async fetchTVGenres() {
    const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${this.tmdb_key}&language=en-US`;
    if (import.meta.env && import.meta.env.DEV) console.debug('[TMDB] tv genres request', { url });
    const response = await fetch(url);
    return await response.json();
  }

  async fetchMovieDetails(movie_id) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${this.tmdb_key}&language=en-US`
    );
    return await response.json();
  }

  async fetchMoviesInTheatres() {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${this.tmdb_key}&language=en-US`;
    if (import.meta.env && import.meta.env.DEV) console.debug('[TMDB] now playing request', { url });
    const response = await fetch(url);
    const data = await response.json();
    return new Set(data.results.map((movie) => movie.id));
  }

  async fetchTVDetails(tv_id) {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${tv_id}?api_key=${this.tmdb_key}&language=en-US`
    );
    return await response.json();
  }

  async fetchTVOnTheAir(page = this.page) {
    const url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${this.tmdb_key}&language=en-US&page=${page}`;
    if (import.meta.env && import.meta.env.DEV) console.debug('[TMDB] on_the_air request', { url });
    const response = await fetch(url);
    return await response.json();
  }

  // controllers
  changeQuery(query, category, page = 1) {
    this.query = query;
    this.category = category;
    this.page = page;
  }

  async fetchTrendingData() {
    // Check if the data has already been fetched for a category.
    if (this.cachedResponse[this.category] && this.cachedResponse[this.category][this.page])
      return this.cachedResponse[this.category][this.page];

    // If not then fetch the data.
    const url = `https://api.themoviedb.org/3/trending/${this.category}/week?api_key=${this.tmdb_key}&page=${this.page}`;
    if (import.meta.env && import.meta.env.DEV) console.debug('[TMDB] trending request', { url });
    const response = await fetch(url);

    // Cache the data for the next time.
    this.cachedResponse[this.category] = this.cachedResponse[this.category] || {};
    this.cachedResponse[this.category][this.page] = await response.json();

    return this.cachedResponse[this.category][this.page];
  }

  async fetchMovieVideos(movie_id) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${this.tmdb_key}&language=en-US`
    );
    return await response.json();
  }

  async fetchTVVideos(tv_id) {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${tv_id}/videos?api_key=${this.tmdb_key}&language=en-US`
    );
    return await response.json();
  }

  async fetchDiscoverMovie({ page = this.page, sort_by = 'popularity.desc', with_genres = '' } = {}) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.tmdb_key}&language=en-US&page=${page}&sort_by=${encodeURIComponent(sort_by)}${with_genres ? `&with_genres=${encodeURIComponent(with_genres)}` : ''}`;
    if (import.meta.env && import.meta.env.DEV) console.debug('[TMDB] discover movie', { url });
    const res = await fetch(url);
    return await res.json();
  }

  async fetchDiscoverTV({ page = this.page, sort_by = 'popularity.desc', with_genres = '' } = {}) {
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${this.tmdb_key}&language=en-US&page=${page}&sort_by=${encodeURIComponent(sort_by)}${with_genres ? `&with_genres=${encodeURIComponent(with_genres)}` : ''}`;
    if (import.meta.env && import.meta.env.DEV) console.debug('[TMDB] discover tv', { url });
    const res = await fetch(url);
    return await res.json();
  }

  async fetchTVSeason(tv_id, season_number) {
    const url = `https://api.themoviedb.org/3/tv/${tv_id}/season/${season_number}?api_key=${this.tmdb_key}&language=en-US`;
    if (import.meta.env && import.meta.env.DEV) console.debug('[TMDB] tv season', { url });
    const res = await fetch(url);
    return await res.json();
  }
}

export default new BunnyChan();
