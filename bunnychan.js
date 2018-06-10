// const API_KEY = 'fa4fa1ba075a48db1aeb756f4343bc23';
class BunnyChan {
  constructor(key) {
    this.key = key;
  }

  // types: token, session
  async authenticate(type) {
    const response = await fetch(`https://api.themoviedb.org/3/authentication/${type}/new?api_key=${this.key}`);
    const data = await response.json();
    return data;
  }

  requestUserPermission(token) {
    window.open(`https://www.themoviedb.org/authenticate/${token}`, '_blank');
  }
}