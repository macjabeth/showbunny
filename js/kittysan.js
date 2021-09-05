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
      // Create elements
      const cardItem = document.createElement('li');
      const cardRating = document.createElement('div');
      const cardTitle = document.createElement('div');
      const titleTag = document.createElement('p');

      // Add Classes
      cardItem.classList.add('card');
      cardRating.classList.add('card__rating');
      cardTitle.classList.add('card__title');

      // Update styling
      cardItem.innerHTML = `<img src="https://image.tmdb.org/t/p/w200${card.poster_path}" alt="${card.title}" />`;

      // Add the content
      cardRating.textContent = card.vote_average;
      titleTag.textContent = card.title;

      // Append to the DOM
      // cardTitle.append(titleTag);
      cardItem.append(cardRating);
      this.elements.popular.append(cardItem);
    }
  }
}
