import dayjs from 'dayjs';
import { getRuntimeString } from '../../utils/utils.js';
import AbstractView from '../abstract-view.js';

const getFilmCardTemplate = (film) => {
  const MAX_DESCRIPTION_LENGTH = 140;
  const {
    title,
    totalRating,
    release,
    runtime,
    genre,
    poster,
    description,
    comments,
    watchlist,
    alreadyWatched,
    favorite,
  } = film;
  const year = dayjs(release.date).get('year').toString();
  const duration = getRuntimeString(runtime);

  const shortDescription = description.length > MAX_DESCRIPTION_LENGTH ? `${description.slice(0, MAX_DESCRIPTION_LENGTH - 1)}…`
    : description;

  const controlActiveClass = 'film-card__controls-item--active';

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genre[0]}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${shortDescription}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlist ? controlActiveClass : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatched ? controlActiveClass : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${favorite ? controlActiveClass : ''}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._openModalHandler = this._openModalHandler.bind(this);
  }

  getTemplate() {
    return getFilmCardTemplate(this._film);
  }

  getFilmData() {
    return this._film;
  }

  _openModalHandler() {
    this._callbacks.openModalClick();
  }

  setOpenModalHandler(callback) {
    this._callbacks.openModalClick = callback;

    const modalTriggers = this.getElement().querySelectorAll('.film-card__title, .film-card__poster, .film-card__comments');
    [...modalTriggers].forEach((element) => {
      element.addEventListener('click', this._openModalHandler);
    });
  }

  removeElement() {
    this._element.removeEventListener('click', this._openModalHandler);
    this._element.remove();
    this._element = null;
  }
}
