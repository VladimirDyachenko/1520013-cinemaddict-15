import SortListView from '../view/films/sort.js';
import FilmListView from '../view/films/films-list.js';
import FilmCardView from '../view/films/film-card.js';
import ShowMoreButtonView from '../view/films/show-more-button.js';
import FilmListExtraView from '../view/films/films-list-extra.js';
import FilmModalView from '../view/films/film-modal.js';
import { renderElement, InsertPosition } from '../utils/dom.js';
import { FilmControlAction, FILMS_PER_ROW, Pages, UserAction } from '../const.js';
import { sortByRating, sortByReleaseDate } from '../utils/film-list.js';
import { sortType, UpdateType } from '../const.js';

export default class FilmList {
  constructor(listContainer, moviesModel, siteNavModel, restService) {
    //Initial
    this._moviesModel = moviesModel;
    this._siteNavModel = siteNavModel;
    this._listContainer = listContainer;
    this._isLoading = true;

    //Views
    this._sortList = new SortListView();
    this._filmList = new FilmListView();
    this._showMoreButton = new ShowMoreButtonView();
    this._filmModal = null;
    this._restService = restService;

    //Other
    this._renderedFilmCardsCount = FILMS_PER_ROW;
    this._renderedCards = new Map();

    //Event handlers
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
    this._showMoreClickHandler = this._showMoreClickHandler.bind(this);
    this._sortClickHandler = this._sortClickHandler.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
  }

  init() {
    this._moviesModel.subscribe(this._handleModelEvent);
    this._siteNavModel.subscribe(this._handleModelEvent);
    this._filmData = this._getFilms();
    this._renderPage();
  }

  _getFilms() {
    const activePage = this._siteNavModel.getActivePage();

    if (activePage === Pages.STATISTIC) {
      return;
    }
    let films;

    switch (activePage) {
      case Pages.All:
        films = this._moviesModel.movies;
        break;
      case Pages.FAVORITE:
        films = [...this._moviesModel.getFiltredMovies().favoriteList];
        break;
      case Pages.HISTORY:
        films = [...this._moviesModel.getFiltredMovies().historyList];
        break;
      case Pages.WATCHLIST:
        films = [...this._moviesModel.getFiltredMovies().watchList];
        break;
      default:
        throw new Error('Missing page');
    }

    return films;
  }

  _renderPage() {
    if (!this._filmData) {
      return;
    }

    this._renderSort();
    this._renderFilmList();

    if (this._filmData.length > 0) {
      this._renderFilmCards(this._filmData.slice(0, Math.min(this._filmData.length, this._renderedFilmCardsCount)));
      this._renderShowMore();
    } else {
      this._renderNoFilms();
    }

    this._renderFilmListExtra();
  }

  _renderSort() {
    renderElement(this._listContainer, this._sortList, InsertPosition.BEFORE_END);
    this._sortList.setClickHandler(this._sortClickHandler);
  }

  _renderFilmList() {
    renderElement(this._listContainer, this._filmList, InsertPosition.BEFORE_END);
  }

  _renderFilmCard(film) {
    const filmCard = new FilmCardView(film, this._handleViewAction);
    filmCard.setOpenModalHandler(() => this._openFilmModal(filmCard.film));
    filmCard.setControlClickHandler(this._handleViewAction);
    this._renderedCards.set(film.id, filmCard);
    renderElement(this._filmList.getFilmContainer(), filmCard, InsertPosition.BEFORE_END);
  }

  _renderFilmCards(films) {
    films.forEach((film) => this._renderFilmCard(film));
  }

  _renderNoFilms() {
    this._filmList.showEmptyMessage(this._siteNavModel.getActivePage(), this._isLoading);
  }

  _clearFilmList(resetRenderedCardsCount) {
    this._renderedCards.forEach((cardView) => cardView.destroyElement());
    this._renderedCards.clear();
    if (resetRenderedCardsCount) {
      this._renderedFilmCardsCount = FILMS_PER_ROW;
    } else {
      this._renderedFilmCardsCount = Math.min(this._filmData.length, this._renderedFilmCardsCount);
    }
    this._removeShowMoreButton();
  }

  _renderShowMore() {
    if (this._filmData.length <= this._renderedFilmCardsCount) {
      return;
    }

    if (this._showMoreButton === null) {
      this._showMoreButton = new ShowMoreButtonView();
    }
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

  _clearPage({ resetRenderedCardsCount = false } = {}) {
    this._sortList.getElement().remove();
    this._sortList.removeElement();
    this._clearFilmList(resetRenderedCardsCount);
    this._filmList.getElement().remove();
    this._filmList.removeElement();
  }

  _showMoreClickHandler() {
    const filmCount = this._filmData.length;
    const newRenderFilmsCount = Math.min(filmCount, this._renderedFilmCardsCount + FILMS_PER_ROW);
    const films = this._filmData.slice(this._renderedFilmCardsCount, newRenderFilmsCount);
    this._renderFilmCards(films);

    this._renderedFilmCardsCount = newRenderFilmsCount;

    if (this._renderedFilmCardsCount >= filmCount) {
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

  async _openFilmModal(filmData) {
    let comments = [];
    try {
      comments = await this._restService.getCommentsForMovie(filmData.id);
    } catch (error) {
      comments = [];
      //TODO отрисовать плашку, что комментарии не удалось загрузить
    }

    if (this._filmModal !== null) {
      //Обновляем так чтобы при открытии нового модального окна
      //сбросить состояние формы комментария
      this._filmModal.filmData = filmData;
      this._filmModal.setComments(comments);
      this._filmModal.updateData({}, true);
      return;
    }

    this._filmModal = new FilmModalView(filmData, comments);
    document.addEventListener('keydown', this._onEscKeyDownHandler);
    this._filmModal.setCloseButtonClick(() => this._onModalCloseClick());
    this._filmModal.setControlClickHandler(this._handleViewAction);
    this._filmModal.setAddCommentHandler(this._handleViewAction);
    this._filmModal.setDeleteCommentHandler(this._handleViewAction);
    this._renderFilmModal();
  }

  _updateRenderedFilmCard(filmData) {
    const filmCard = this._renderedCards.get(filmData.id);

    if (filmCard) {
      filmCard.film = filmData;
      filmCard.updateElement();
    }
  }

  _updateFilmModal(filmData) {
    if (this._filmModal !== null && this._filmModal.filmData.id === filmData.id) {
      this._openFilmModal(filmData);
    }
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

        if (payload.filmData.alreadyWatched) {
          payload.filmData.watchingDate = new Date().toISOString();
        } else {
          payload.filmData.watchingDate = null;
        }

        break;
      case FilmControlAction.favorite:
        payload.filmData.favorite = !payload.filmData.favorite;
        break;
      default:
        throw new Error(`Unhandled action: ${payload.action}`);
    }

    this._restService.updateMovie(payload.filmData)
      .then((response) => this._moviesModel.updateMovie(UpdateType.MINOR, response));

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
        this._filmData = this._getFilms();
        break;
      default:
        throw new Error(`Unhandled sort type ${selectedSort}`);
    }

    this._clearFilmList();
    this._renderFilmCards(this._filmData.slice(0, this._renderedFilmCardsCount));
    this._showMoreButton = new ShowMoreButtonView();
    this._renderShowMore();
  }

  /**
   * @param {UserAction} userAction
   * @param {{}} update
   */
  _handleViewAction(userAction, update) {
    switch (userAction) {
      case UserAction.UPDATE_FILM:
        this._filmControlClickHandler(update);
        break;
      case UserAction.ADD_COMMENT:
        this._restService.addComment(update)
          .then((movie) => this._moviesModel.addComment(UpdateType.PATCH, movie));
        break;
      case UserAction.DELETE_COMMENT:
        this._restService.deleteComment(update.commentId)
          .then(() => this._moviesModel.deleteComment(UpdateType.PATCH, update))
          .catch(() => {
            if (this._filmModal !== null) {
              this._filmModal.onDeleteCommentError(update.commentId);
            }
          });
        break;
      default:
        throw new Error(`Unhandled view action ${userAction}`);
    }
  }

  _handleModelEvent(updateType, data) {
    this._filmData = this._getFilms();
    switch (updateType) {
      case UpdateType.PATCH:
        this._updateRenderedFilmCard(data);
        break;
      case UpdateType.MINOR:
        this._clearPage();
        this._renderPage();
        break;
      case UpdateType.MAJOR:
        this._clearPage({ resetRenderedCardsCount: true });
        this._renderPage();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        this._clearPage({ resetRenderedCardsCount: true });
        this._renderPage();
        break;
      default:
        throw new Error(`Unhandled updateType ${updateType}`);
    }
    this._updateFilmModal(data);
  }

  destroy() {
    this._moviesModel.unsubscribe(this._handleModelEvent);
    this._siteNavModel.unsubscribe(this._handleModelEvent);

    if (this._sortList) {
      this._sortList.getElement().remove();
      this._sortList.removeElement();
    }

    if (this._filmList) {
      this._filmList.getElement().remove();
      this._filmList.removeElement();
    }
  }
}
