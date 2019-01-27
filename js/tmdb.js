class TMDB {
  constructor () {
    this.key = 'fa4fa1ba075a48db1aeb756f4343bc23';
    this.fetchConfiguration().then(data => {
      this.config = data;
    });
  }

  async search (query, page = 1) {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${this.key}&language=en-US&query=${query}&page=${page}&include_adult=false`);
    return response.json();
  }

  async fetchConfiguration () {
    const response = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${this.key}`);
    return response.json();
  }
}

export default TMDB;
