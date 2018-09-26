// handles API logic
class BunnyChan {
  constructor() {
    this.tmdb_key = 'fa4fa1ba075a48db1aeb756f4343bc23';
    this.spider_key = '4VQ6XG7DQ6o6EhxC';
    this.query = 'bunny';
    this.category = 'movie';
    this.page = 1;
    this.movie_genres = [];
    this.tv_genres = [];

    // fetch the movie genres
    this.fetchMovieGenres()
      .then(data => this.movie_genres = data.genres)
      .catch(err => console.error(err));

    // fetch the tv genres
    this.fetchTVGenres()
      .then(data => this.tv_genres = data.genres)
      .catch(err => console.error(err));
  }

  // user authentication
  async createRequestToken() {
    const response = await fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${this.tmdb_key}`);
    return await response.json();
  }

  async createSession(token) {
    const response = await fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${this.tmdb_key}&request_token=${token}`);
    return await response.json();
  }

  static requestUserPermission(token) {
    window.open(`https://www.themoviedb.org/authenticate/${token}`, '_blank');
  }

  // queries and genres
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

  async fetchTVDetails(tv_id) {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${tv_id}?api_key=${this.tmdb_key}&language=en-US`);
    return await response.json();
  }

  // streaming videos
  getMovieStream(movie_id) {
    return `https://videospider.in/getvideo?key=${this.spider_key}&video_id=${movie_id}&tmdb=1`;
  }

  getTVStream(tv_id, season, episode) {
    return `https://videospider.in/getvideo?key=${this.spider_key}&video_id=${tv_id}&tmdb=1&tv=1&s=${season}&e=${episode}`;
  }

  // controllers
  changeQuery(query, category, page = 1) {
    this.query = query;
    this.category = category;
    this.page = page;
  }
}
