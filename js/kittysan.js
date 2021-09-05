/**
 * KittySan
 * This class handles DOM manipulation.
 */

export default class KittySan {
  constructor() {
    this.elements = {
      popular: document.querySelector('#popular .cards')
    };
  }

  paintPopularMovies(cards) {
    for (const card of cards) {
      // Create movie poster element
      const moviePoster = document.createElement('movie-poster');

      moviePoster.dataset.posterPath = card.poster_path;
      moviePoster.dataset.rating = card.vote_average;

      // Append to the DOM
      this.elements.popular.append(moviePoster);
    }
  }
}
