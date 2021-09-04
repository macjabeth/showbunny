/**
 * BunnyChan
 * This class handles API logic for TMDB.
 */

export default class BunnyChan {
  constructor() {
    this.tmdb_key = 'fa4fa1ba075a48db1aeb756f4343bc23';
    this.session_id = '';
    this.query = '';
    this.category = 'movie';
    this.page = 1;
    this.movie_genres = [];
    this.tv_genres = [];
    this.cachedResponse = {};

    // fetch the movie genres
    this.fetchMovieGenres()
      .then(data => (this.movie_genres = data.genres))
      .catch(err => console.error(err));

    // fetch the tv genres
    this.fetchTVGenres()
      .then(data => (this.tv_genres = data.genres))
      .catch(err => console.error(err));

    // fetch movies in theatres
    this.fetchMoviesInTheatres()
      .then(data => (this.inTheatres = data))
      .catch(err => console.error(err));
  }

  /***************************************/
  /* (>^.^>) User Authentication (<^.^<) */
  /***************************************/

  async getRequestToken() {
    const data = await fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${this.tmdb_key}`).then(res => res.json());
    if (!data.success) throw new Error(`Error creating request token; ${data.status_message}`);
    return data.request_token;
  }

  async createSession() {
    const request_token = await this.getRequestToken();
    const data = await fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${this.tmdb_key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ request_token })
    }).then(res => res.json());
    if (!data.success) throw new Error(`Error creating session; ${data.status_message}`);
    this.session_id = data.session_id;
  }

  static requestUserPermission(token) {
    window.open(`https://www.themoviedb.org/authenticate/${token}`, '_blank');
  }

  /***************************************/
  /*    (>^.^>) Data Queries (<^.^<)     */
  /***************************************/

  async fetchData() {
    const response = await fetch(`https://api.themoviedb.org/3/search/${this.category}?api_key=${this.tmdb_key}&query=${this.query}&page=${this.page}`);
    return await response.json();
  }

  async fetchMovieGenres() {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.tmdb_key}&language=en-US`);
    return await response.json();
  }

  async fetchTVGenres() {
    const response = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${this.tmdb_key}&language=en-US`);
    return await response.json();
  }

  async fetchMovieDetails(movie_id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${this.tmdb_key}&language=en-US`);
    return await response.json();
  }

  async fetchMoviesInTheatres() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${this.tmdb_key}&language=en-US`);
    const data = await response.json();
    return new Set(data.results.map(movie => movie.id));
  }

  async fetchTVDetails(tv_id) {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${tv_id}?api_key=${this.tmdb_key}&language=en-US`);
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
    if (this.cachedResponse[this.category] && this.cachedResponse[this.category][this.page]) return this.cachedResponse[this.category][this.page];

    // If not then fetch the data.
    const response = await fetch(`https://api.themoviedb.org/3/trending/${this.category}/week?api_key=${this.tmdb_key}&page=${this.page}`);

    // Cache the data for the next time.
    this.cachedResponse[this.category] = this.cachedResponse[this.category] || {};
    this.cachedResponse[this.category][this.page] = await response.json();

    return this.cachedResponse[this.category][this.page];
  }

  async fetchMovieVideos(movie_id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${this.tmdb_key}&language=en-US`);
    return await response.json();
  }

  async fetchTVVideos(tv_id) {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${tv_id}/videos?api_key=${this.tmdb_key}&language=en-US`);
    return await response.json();
  }
}
