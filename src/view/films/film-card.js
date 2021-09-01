import dayjs from 'dayjs';
import { getRuntimeString } from '../../utils/utils.js';
import SmartView from '../smart-view.js';
import { FilmControlAction } from '../../const.js';

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
    isWatchlist,
    isAlreadyWatched,
    isFavorite,
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
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${isWatchlist ? controlActiveClass : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${isAlreadyWatched ? controlActiveClass : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${isFavorite ? controlActiveClass : ''}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends SmartView {
  constructor(film) {
    super();
    this._data = FilmCard.parseFilmToData(film);
    this._openModalHandler = this._openModalHandler.bind(this);
    this._controlClickHandler = this._controlClickHandler.bind(this);
    this._controlActiveClass = 'film-card__controls-item--active';
    this._controlWatchlistClass = 'film-card__controls-item--add-to-watchlist';
    this._controlWatchedClass = 'film-card__controls-item--mark-as-watched';
    this._controlFavoriteClass = 'film-card__controls-item--favorite';
  }

  getTemplate() {
    return getFilmCardTemplate(this._data);
  }

  get film() {
    return FilmCard.parseDataToFilm(this._data);
  }

  set film(film) {
    this._data = FilmCard.parseFilmToData(film);
  }

  _openModalHandler() {
    this._callbacks.openModalClick();
  }

  _controlClickHandler(event) {
    const data = { action: undefined, filmData: this.film };
    const classList = event.target.classList;
    if (classList.contains(this._controlWatchlistClass)) {
      data.action = FilmControlAction.watchlist;
    } else if (classList.contains(this._controlWatchedClass)) {
      data.action = FilmControlAction.watched;
    } else if (classList.contains(this._controlFavoriteClass)) {
      data.action = FilmControlAction.favorite;
    }
    this._callbacks.controlClick(data);
  }

  setOpenModalHandler(callback) {
    this._callbacks.openModalClick = callback;

    const modalTriggers = this.getElement().querySelectorAll('.film-card__title, .film-card__poster, .film-card__comments');
    [...modalTriggers].forEach((element) => {
      element.addEventListener('click', this._openModalHandler);
    });
  }

  setControlClickHandler(callback) {
    this._callbacks.controlClick = callback;
    this._controlButtons = [...this.getElement().querySelectorAll('.film-card__controls-item')];
    this._controlButtons.forEach((button) => {
      button.addEventListener('click', this._controlClickHandler);
    });
  }

  updateControl(action) {
    let button;
    switch (action) {
      case FilmControlAction.watchlist:
        button = this._element.querySelector(`.${this._controlWatchlistClass}`);
        break;
      case FilmControlAction.watched:
        button = this._element.querySelector(`.${this._controlWatchedClass}`);
        break;
      case FilmControlAction.favorite:
        button = this._element.querySelector(`.${this._controlFavoriteClass}`);
        break;
      default:
        throw new Error(`Unhandled action: ${action}`);
    }

    button.classList.toggle(this._controlActiveClass);
  }

  restoreHandlers() {
    this.setOpenModalHandler(this._callbacks.openModalClick);
    this.setControlClickHandler(this._callbacks.controlClick);
  }

  destroyElement() {
    this._element.removeEventListener('click', this._openModalHandler);
    this._controlButtons.forEach((button) => {
      button.removeEventListener('click', this._controlClickHandler);
    });
    this._element.remove();
    this._element = null;
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        isWatchlist: film.watchlist,
        isAlreadyWatched: film.alreadyWatched,
        isFavorite: film.favorite,
      },
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete data.isWatchlist;
    delete data.isAlreadyWatched;
    delete data.isFavorite;

    return data;
  }

}
