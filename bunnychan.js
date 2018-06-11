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
    this.fetchGenres()
      .then(data => this.movie_genres = data.genres)
      .catch(err => console.error(err));

    // fetch tv genres
    this.fetchGenres()
      .then(data => this.tv_genres = data.genres)
      .catch(err => console.error(err));
  }

  // user authentication
  async createRequestToken() {
    const response = await fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${this.key}`);
    const data = await response.json();
    return data;
  }

  async createSession(token) {
    const response = await fetch(`https://api.themoviedb.org/3/authentication/token/new?api_key=${this.key}&request_token=${token}`);
    const data = await response.json();
    return data;
  }

  requestUserPermission(token) {
    window.open(`https://www.themoviedb.org/authenticate/${token}`, '_blank');
  }

  // fetching data
  async fetchData() {
    const response = await fetch(`https://api.themoviedb.org/3/search/${this.category}?api_key=${this.key}&query=${this.query}&page=${this.page}`);
    const data = await response.json();
    return data;
  }

  async fetchGenres() {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.key}&language=en-US`);
    const data = await response.json();
    return data;
  }

  async fetchTVGenres() {
    const response = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${this.key}&language=en-US`);
    const data = await response.json();
    return data;
  }

  // controllers?
  changeQuery(query, category, page = 1) {
    this.query = query;
    this.category = category;
    this.page = page;
  }
}