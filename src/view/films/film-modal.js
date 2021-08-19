import dayjs from 'dayjs';
import { getRuntimeString } from '../../utils/utils';
import { getCommentsTemplate } from './comment';
import AbstractView from '../abstract-view.js';
import { FilmControlAction } from '../../utils/utils.js';

const getFilmModalTemplate = (filmData) => {
  const {
    title,
    alternativeTitle,
    totalRating,
    poster,
    ageRating,
    director,
    writers,
    actors,
    release,
    runtime,
    genre,
    description,
    watchlist,
    alreadyWatched,
    favorite,
    comments,
  } = filmData;

  const releaseDate = dayjs(release.date).format('D MMMM YYYY').toString();
  const duration = getRuntimeString(runtime);
  const genreTemplate = genre
    .map((item) => `<span class="film-details__genre">${item}</span>`)
    .join('');

  const controlActiveClass = 'film-details__control-button--active';
  const commentsTemplate = getCommentsTemplate(comments);
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">
          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${release.country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
              <td class="film-details__cell">
              ${genreTemplate}
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button
          film-details__control-button--watchlist
          ${watchlist ? controlActiveClass : ''}"
          id="watchlist" name="watchlist"
        >
          Add to watchlist
        </button>
        <button type="button" class="film-details__control-button
          film-details__control-button--watched
          ${alreadyWatched ? controlActiveClass : ''}"
          id="watched"
          name="watched"
        >
          Already watched
        </button>
        <button type="button"
          class="film-details__control-button
          film-details__control-button--favorite
          ${favorite ? controlActiveClass : ''}"
          id="favorite"
          name="favorite"
        >
          Add to favorites
        </button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">${commentsTemplate}</ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
  </section>`;
};

export default class FilmModal extends AbstractView {
  constructor(filmData) {
    super();
    this._film = filmData;
    this.onInit();
    this._closeModalHandler = this._closeModalHandler.bind(this);
    this._controlClickHandler = this._controlClickHandler.bind(this);
    this._controlActiveClass = 'film-details__control-button--active';
    this._controlWatchlistClass = 'film-details__control-button--watchlist';
    this._controlWatchedClass = 'film-details__control-button--watched';
    this._controlFavoriteClass = 'film-details__control-button--favorite';

  }

  get filmData() {
    return this._film;
  }

  set filmData(filmData) {
    this._film = filmData;
  }

  onInit() {
    document.body.classList.add('hide-overflow');
  }

  getTemplate() {
    return getFilmModalTemplate(this._film);
  }

  _closeModalHandler() {
    this._callbacks.closeButtonClick();
  }

  setCloseButtonClick(callback) {
    this._callbacks.closeButtonClick = callback;
    this._closeButton = this.getElement().querySelector('.film-details__close-btn');
    this._closeButton.addEventListener('click', this._closeModalHandler);
  }

  _controlClickHandler(event) {
    const data = { action: undefined, filmData: this._film };
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

  setControlClickHandler(callback) {
    this._callbacks.controlClick = callback;
    this._controlButtons = [...this.getElement().querySelectorAll('.film-details__control-button')];
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

  removeElement() {
    this._closeButton.removeEventListener('click', this._closeModalHandler);
    this._controlButtons.forEach((button) => {
      button.removeEventListener('click', this._controlClickHandler);
    });
    this._element.remove();
    this._element = null;
    document.body.classList.remove('hide-overflow');
  }
}
