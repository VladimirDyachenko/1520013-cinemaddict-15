import dayjs from 'dayjs';
import { getRuntimeString } from '../../utils/utils.js';
import { getCommentsTemplate } from './comment.js';
import SmartView from '../smart-view.js';
import { FilmControlAction, UserAction } from '../../const.js';

const getFilmModalTemplate = (filmData, comments) => {
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
    isComments,
    isWatchlist,
    isAlreadyWatched,
    isFavorite,
    selectedEmoji,
    commentText,
  } = filmData;

  const releaseDate = dayjs(release.date).format('D MMMM YYYY').toString();
  const duration = getRuntimeString(runtime);
  const genreTemplate = genre
    .map((item) => `<span class="film-details__genre">${item}</span>`)
    .join('');

  const controlActiveClass = 'film-details__control-button--active';
  const commentsTemplate = isComments ? getCommentsTemplate(comments) : '';

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
          ${isWatchlist ? controlActiveClass : ''}"
          id="watchlist" name="watchlist"
        >
          Add to watchlist
        </button>
        <button type="button" class="film-details__control-button
          film-details__control-button--watched
          ${isAlreadyWatched ? controlActiveClass : ''}"
          id="watched"
          name="watched"
        >
          Already watched
        </button>
        <button type="button"
          class="film-details__control-button
          film-details__control-button--favorite
          ${isFavorite ? controlActiveClass : ''}"
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

        <ul class="film-details__comments-list">${isComments ? commentsTemplate : ''}</ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${selectedEmoji ? `<img src="images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-${selectedEmoji}"></img>` :''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText ? commentText : ''}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${selectedEmoji === 'smile' ? 'checked': ''}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${selectedEmoji === 'sleeping' ? 'checked': ''}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${selectedEmoji === 'puke' ? 'checked': ''}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${selectedEmoji === 'angry' ? 'checked': ''}>
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

export default class FilmModal extends SmartView {
  constructor(data, comments) {
    super();
    this._data = FilmModal.parseFilmToData(data);
    this._closeModalHandler = this._closeModalHandler.bind(this);
    this._controlClickHandler = this._controlClickHandler.bind(this);
    this._emojiPickHandler = this._emojiPickHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._addCommentHandler = this._addCommentHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
    this._controlActiveClass = 'film-details__control-button--active';
    this._controlWatchlistClass = 'film-details__control-button--watchlist';
    this._controlWatchedClass = 'film-details__control-button--watched';
    this._controlFavoriteClass = 'film-details__control-button--favorite';
    this._comments = comments;

    this.onInit();
  }

  get filmData() {
    return FilmModal.parseDataToFilm(this._data);
  }

  set filmData(film) {
    this._data = FilmModal.parseFilmToData(film);
  }

  setComments(comments) {
    this._comments = comments;
  }

  onInit() {
    document.body.classList.add('hide-overflow');
    this._setInnerHandlers();
  }

  getTemplate() {
    return getFilmModalTemplate(this._data, this._comments);
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
    const data = { action: undefined, filmData: this.filmData };
    const classList = event.target.classList;

    if (classList.contains(this._controlWatchlistClass)) {
      data.action = FilmControlAction.watchlist;
    } else if (classList.contains(this._controlWatchedClass)) {
      data.action = FilmControlAction.watched;
    } else if (classList.contains(this._controlFavoriteClass)) {
      data.action = FilmControlAction.favorite;
    }
    this._callbacks.controlClick(UserAction.UPDATE_FILM, data);
  }

  _addCommentHandler(event) {
    // Enter становиться \n при нажатом ctrl
    if(!event.ctrlKey || event.key !== '\n') {
      return;
    }

    const commentInput = this.getElement().querySelector('.film-details__comment-input');
    const emojiInput = this.getElement().querySelector('.film-details__emoji-item:checked');

    if (!emojiInput) {
      return;
    }

    const commentText = commentInput.value;

    if (commentText.length < 1) {
      return;
    }

    const movieId = this._data.id;
    const selectedEmoji = emojiInput.value;

    this._callbacks.addComment(UserAction.ADD_COMMENT, { movieId, commentText, selectedEmoji});
  }

  _deleteCommentHandler(event) {
    event.preventDefault();

    const commentId = event.target.dataset.id;
    const movieId = this._data.id;

    this._callbacks.deleteComment(UserAction.DELETE_COMMENT, { movieId,  commentId});
  }

  setControlClickHandler(callback) {
    this._callbacks.controlClick = callback;
    this._controlButtons = [...this.getElement().querySelectorAll('.film-details__control-button')];
    this._controlButtons.forEach((button) => {
      button.addEventListener('click', this._controlClickHandler);
    });
  }

  setAddCommentHandler(callback) {
    this._callbacks.addComment = callback;
    window.addEventListener('keypress' , this._addCommentHandler);
  }

  setDeleteCommentHandler(callback) {
    this._callbacks.deleteComment = callback;

    const commentDeleteButtons = this.getElement().querySelectorAll('.film-details__comment-delete');
    [...commentDeleteButtons].forEach((element) => {
      element.addEventListener('click', this._deleteCommentHandler);
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

  _emojiPickHandler(event) {
    event.preventDefault();
    const updatedData = Object.assign({}, this._data, { selectedEmoji: event.target.value });
    this.updateData(updatedData, true);
  }

  _commentInputHandler(event) {
    const updatedData = Object.assign({}, this.data, { commentText: event.target.value });
    this.updateData(updatedData, false);
  }

  _setInnerHandlers() {
    const emojiInputs = this.getElement().querySelectorAll('.film-details__emoji-item');

    [...emojiInputs].forEach((element) => {
      element.addEventListener('input', this._emojiPickHandler);
    });

    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseButtonClick(this._callbacks.closeButtonClick);
    this.setControlClickHandler(this._callbacks.controlClick);
    this.setAddCommentHandler(this._callbacks.addComment);
    this.setDeleteCommentHandler(this._callbacks.deleteComment);
  }

  destroyElement() {
    this._closeButton.removeEventListener('click', this._closeModalHandler);
    this._controlButtons.forEach((button) => {
      button.removeEventListener('click', this._controlClickHandler);
    });
    this._element.remove();
    this._element = null;
    window.removeEventListener('keypress', this._addCommentHandler);
    document.body.classList.remove('hide-overflow');
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        isComments: film.comments.length > 0,
        isWatchlist: film.watchlist,
        isAlreadyWatched: film.alreadyWatched,
        isFavorite: film.favorite,
        selectedEmoji: undefined,
        commentText: '',
      },
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete data.isComments;
    delete data.isWatchlist;
    delete data.isAlreadyWatched;
    delete data.isFavorite;
    delete data.selectedEmoji;
    delete data.commentText;

    return data;
  }
}
