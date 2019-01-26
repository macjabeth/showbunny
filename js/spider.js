class Spider {
  constructor () {
    this.key = '4VQ6XG7DQ6o6EhxC';
  }

  getMovieStream (id) {
    const url = `https://videospider.in/getvideo?key=${this.key}&video_id=${id}&tmdb=1`;
    return `<iframe src="${url}" class="dialog-iframe" width="100%" height="100%" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>`;
  }

  getTVStream (id, season, episode) {
    const url = `https://videospider.in/getvideo?key=${this.key}&video_id=${id}&tmdb=1&tv=1&s=${season}&e=${episode}`;
    return `<iframe src="${url}" class="dialog-iframe" width="100%" height="100%" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>`;
  }
}

export default Spider;
