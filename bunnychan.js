// bunnychan handles api logic
class BunnyChan {
  constructor() {
    this.key = 'fa4fa1ba075a48db1aeb756f4343bc23';
    this.query = 'bunny';
    this.category = 'movie';
    this.page = 1;
    this.movie_genres = [];
    this.tv_genres = [];

    // fetch movie genres
    this.fetchMovieGenres()
      .then(data => this.movie_genres = data.genres)
      .catch(err => console.error(err));

    // fetch tv genres
    this.fetchTVGenres()
      .then(data => this.tv_genres = data.genres)
      .catch(err => console.error(err));
  }

  // user authentication
  async createRequestToken() {
    const response = await fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${this.key}`);
    return await response.json();
  }

  async createSession(token) {
    const response = await fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${this.key}&request_token=${token}`);
    return await response.json();
  }

  static requestUserPermission(token) {
    window.open(`https://www.themoviedb.org/authenticate/${token}`, '_blank');
  }

  // fetching data
  async fetchData() {
    const response = await fetch(`https://api.themoviedb.org/3/search/${this.category}?api_key=${this.key}&query=${this.query}&page=${this.page}`);
    return await response.json();
  }

  async fetchMovieGenres() {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.key}&language=en-US`);
    return await response.json();
  }

  async fetchTVGenres() {
    const response = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${this.key}&language=en-US`);
    return await response.json();
  }

  // controllers
  changeQuery(query, category, page = 1, fetch) {
    this.query = query;
    this.category = category;
    this.page = page;
    if (fetch) fetchData();
  }
}