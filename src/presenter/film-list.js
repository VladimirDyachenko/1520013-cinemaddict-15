import SiteMenuView from '../view/site-menu.js';
import SortListView from '../view/films/sort.js';
import FilmListView from '../view/films/films-list.js';
import FilmCardView from '../view/films/film-card.js';
import ShowMoreButtonView from '../view/films/show-more-button.js';
import FilmListExtraView from '../view/films/films-list-extra.js';
import FilmModalView from '../view/films/film-modal.js';
import { renderElement, InsertPosition } from '../utils/dom.js';
import { FilmControlAction, FILMS_PER_ROW } from '../const.js';
import { sortByRating, sortByReleaseDate } from '../utils/film-list.js';
import { sortType } from '../const.js';

export default class FilmList {
  constructor(listContainer, moviesModel) {
    //Initial
    this._moviesModel = moviesModel;
    this._listContainer = listContainer;
    this._filmData = this._moviesModel.movies;
    this._sortedFilmData = this._moviesModel.getFiltredMovies();

    //Views
    this._siteMenu = new SiteMenuView(this._sortedFilmData);
    this._sortList = new SortListView();
    this._filmList = new FilmListView();
    this._showMoreButton = new ShowMoreButtonView();
    this._filmModal = null;

    //Other
    this._lastRenderedFilmCardIndex = 0;
    this._limit = FILMS_PER_ROW;
    this._renderedCards = new Map();

    //Event handlers
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
    this._showMoreClickHandler = this._showMoreClickHandler.bind(this);
    this._filmControlClickHandler = this._filmControlClickHandler.bind(this);
    this._sortClickHandler = this._sortClickHandler.bind(this);
  }

  init() {
    this._renderMenu();
    this._renderSort();
    this._renderFilmList();
    this._filmData.length > 0 ? this._renderFilmCardsRow() : this._filmList.showEmptyMessage();
    this._renderShowMore();
    this._renderFilmListExtra();
  }

  _renderMenu() {
    renderElement(this._listContainer, this._siteMenu, InsertPosition.AFTER_BEGIN);
  }

  _renderSort() {
    renderElement(this._listContainer, this._sortList, InsertPosition.BEFORE_END);
    this._sortList.setClickHandler(this._sortClickHandler);
  }

  _renderFilmList() {
    renderElement(this._listContainer, this._filmList, InsertPosition.BEFORE_END);
  }

  _renderFilmCardsRow() {
    for(this._lastRenderedFilmCardIndex; this._lastRenderedFilmCardIndex < this._limit; this._lastRenderedFilmCardIndex++) {
      const filmData = this._filmData[this._lastRenderedFilmCardIndex];
      const filmCard = new FilmCardView(filmData);
      filmCard.setOpenModalHandler(() => this._openFilmModal(filmCard.filmData));
      filmCard.setControlClickHandler(this._filmControlClickHandler);

      renderElement(this._filmList.getFilmContainer(), filmCard, InsertPosition.BEFORE_END);
      this._renderedCards.set(filmData.id, filmCard);
    }

    this._limit = this._lastRenderedFilmCardIndex + FILMS_PER_ROW < this._filmData.length ?
      this._lastRenderedFilmCardIndex + FILMS_PER_ROW :
      this._filmData.length;

    return this._filmData.length - this._lastRenderedFilmCardIndex;
  }

  _clearFilmList() {
    this._renderedCards.forEach((cardView) => cardView.removeElement());
    this._renderedCards.clear();
    this._limit = FILMS_PER_ROW;
    this._lastRenderedFilmCardIndex = 0;
    this._removeShowMoreButton();
  }

  _renderShowMore() {
    renderElement(this._filmList.getFilmSection(), this._showMoreButton, InsertPosition.BEFORE_END);
    this._showMoreButton.setClickHandler(this._showMoreClickHandler);
  }

  _renderFilmListExtra() {
    renderElement(this._filmList.getElement(), new FilmListExtraView(), InsertPosition.BEFORE_END);
    renderElement(this._filmList.getElement(), new FilmListExtraView(), InsertPosition.BEFORE_END);
  }

  _renderFilmModal() {
    renderElement(document.body, this._filmModal, InsertPosition.BEFORE_END);
  }

  _showMoreClickHandler() {
    const filmsLeft = this._renderFilmCardsRow();
    if (filmsLeft === 0 ) {
      this._removeShowMoreButton();
    }
  }

  _removeShowMoreButton() {
    if (this._showMoreButton !== null) {
      this._showMoreButton.getElement().remove();
      this._showMoreButton.removeElement();
      this._showMoreButton = null;
    }
  }

  _openFilmModal(filmData) {
    if (this._filmModal !== null) {
      //Обновляем так чтобы при открытии нового модального окна
      //сбросить состояние формы комментария
      this._filmModal.filmData = filmData;
      this._filmModal.updateData({}, true);
      return;
    }

    this._filmModal = new FilmModalView(filmData);
    document.addEventListener('keydown', this._onEscKeyDownHandler);
    this._filmModal.setCloseButtonClick(() => this._onModalCloseClick());
    this._filmModal.setControlClickHandler(this._filmControlClickHandler);
    this._renderFilmModal();
  }

  _closeFilmModal() {
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
    this._filmModal.destroyElement();
    this._filmModal = null;
  }

  _onEscKeyDownHandler(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this._closeFilmModal();
    }
  }

  _onModalCloseClick() {
    this._closeFilmModal();
  }

  _filmControlClickHandler(payload) {
    switch (payload.action) {
      case FilmControlAction.watchlist:
        payload.filmData.watchlist = !payload.filmData.watchlist;
        break;
      case FilmControlAction.watched:
        payload.filmData.alreadyWatched = !payload.filmData.alreadyWatched;
        break;
      case FilmControlAction.favorite:
        payload.filmData.favorite = !payload.filmData.favorite;
        break;
      default:
        throw new Error(`Unhandled action: ${payload.action}`);
    }

    this._moviesModel.updateMovie(payload.filmData);
    this._filmData = this._moviesModel.movies;
    this._sortedFilmData = this._moviesModel.getFiltredMovies();

    const filmCard = this._renderedCards.get(payload.filmData.id);

    if (filmCard) {
      filmCard.filmData = payload.filmData;
      filmCard.updateControl(payload.action);
    }

    if (this._filmModal !== null && this._filmModal.filmData.id === payload.filmData.id) {
      this._filmModal.filmData = payload.filmData;
      this._filmModal.updateControl(payload.action);
    }
  }

  _sortClickHandler(selectedSort) {
    switch (selectedSort) {
      case sortType.RATING:
        this._filmData.sort(sortByRating);
        break;
      case sortType.DATE:
        this._filmData.sort(sortByReleaseDate);
        break;
      case sortType.DEFAULT:
        this._filmData = this._moviesModel.movies;
        break;
      default:
        throw new Error(`Unhandled sort type ${selectedSort}`);
    }

    this._clearFilmList();
    this._showMoreButton = new ShowMoreButtonView();
    this._renderShowMore();
    this._renderFilmCardsRow();
  }
}
