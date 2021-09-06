import BunnyChan from './bunnychan';

/**
 * KittySan
 * This class handles DOM manipulation.
 */

class KittySan {
  constructor() {
    this.elements = {
      popularMovies: document.querySelector('#popular .movie-cards'),
      popularShows: document.querySelector('#popular .show-cards')
    };
  }

  async meow() {
    this.paintPopularMovies();
    this.paintPopularShows();
  }

  async paintPopularMovies() {
    BunnyChan.category = 'movie';

    const data = await BunnyChan.fetchTrendingData();
    const cards = data.results;

    cards.sort((a, b) => b.vote_average - a.vote_average);

    for (const card of cards) {
      // Create movie poster element
      const moviePoster = document.createElement('media-poster');

      moviePoster.dataset.posterPath = card.poster_path;
      moviePoster.dataset.rating = card.vote_average;

      // Append to the DOM
      this.elements.popularMovies.append(moviePoster);
    }
  }

  async paintPopularShows() {
    BunnyChan.category = 'tv';

    const data = await BunnyChan.fetchTrendingData();
    const cards = data.results;

    cards.sort((a, b) => b.vote_average - a.vote_average);

    for (const card of cards) {
      // Create movie poster element
      const tvPoster = document.createElement('media-poster');

      tvPoster.dataset.posterPath = card.poster_path;
      tvPoster.dataset.rating = card.vote_average;

      // Grab TV episode count
      const details = await BunnyChan.fetchTVDetails(card.id);
      tvPoster.dataset.episodeCount = details.number_of_episodes;

      // Append to the DOM
      this.elements.popularShows.append(tvPoster);
    }
  }
}

export default new KittySan();
