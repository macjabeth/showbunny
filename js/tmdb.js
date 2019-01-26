class TMDB {
  constructor () {
    this.key = 'fa4fa1ba075a48db1aeb756f4343bc23';
  }

  async search (query, page = 1) {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${this.key}&language=en-US&query=${query}&page=${page}&include_adult=false`);
    return response.json();
  }
}

export default TMDB;
