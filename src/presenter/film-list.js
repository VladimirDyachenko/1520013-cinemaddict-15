import SortListView from '../view/films/sort.js';
import FilmListView from '../view/films/films-list.js';
import FilmCardView from '../view/films/film-card.js';
import ShowMoreButtonView from '../view/films/show-more-button.js';
import FilmListExtraView from '../view/films/films-list-extra.js';
import FilmModalView from '../view/films/film-modal.js';
import { renderElement, InsertPosition, toast } from '../utils/dom.js';
import { FilmControlAction, FILMS_PER_ROW, Pages, UserAction } from '../const.js';
import { sortByRating, sortByReleaseDate } from '../utils/film-list.js';
import { sortType, UpdateType } from '../const.js';
import { isOnline } from '../utils/utils.js';

export default class FilmList {
  constructor(listContainer, moviesModel, siteNavModel, restService) {
    //Initial
    this._listContainer = listContainer;
    this._moviesModel = moviesModel;
    this._siteNavModel = siteNavModel;
    this._restService = restService;
    this._isLoading = true;

    //Views
    this._sortList = new SortListView();
    this._filmList = new FilmListView();
    this._showMoreButton = new ShowMoreButtonView();
    this._filmModal = null;
    this._topRatedView = new FilmListExtraView('Top rated');
    this._topCommentedView = new FilmListExtraView('Most commented');

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
        films = [...this._moviesModel.getFilteredMovies().favoriteList];
        break;
      case Pages.HISTORY:
        films = [...this._moviesModel.getFilteredMovies().historyList];
        break;
      case Pages.WATCHLIST:
        films = [...this._moviesModel.getFilteredMovies().watchList];
        break;
      default:
        throw new Error(`Missing page ${activePage}`);
    }

    return films;
  }

  _renderPage() {
    if (!this._filmData) {
      return;
    }

    if (this._filmData.length > 0) {
      this._renderSort();
    }

    this._renderFilmList();
    this._renderFilmListExtra();
    if (this._filmData.length === 0) {
      this._filmList.showEmptyMessage(this._siteNavModel.getActivePage(), this._isLoading);
      return;
    }

    //?????? ???????????????? ???????????????????????? ???????????????????? ???????????? ????????????????
    //???????? ?????? ???????? ?????????????????? ?? ???????? ???? ?????????????????? ???? ???????????? ????????????
    if (
      this._filmData.length > this._renderedFilmCardsCount
      && this._renderedFilmCardsCount % FILMS_PER_ROW !== 0
    ) {
      this._renderedFilmCardsCount++;
    }
    const filmsToRender = this._filmData.slice(0, Math.min(this._filmData.length, this._renderedFilmCardsCount));

    this._renderFilmCards(filmsToRender);
    this._renderShowMore();
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
    renderElement(this._filmList.getElement(), this._topRatedView, InsertPosition.BEFORE_END);
    this._topRatedView.hide();
    renderElement(this._filmList.getElement(), this._topCommentedView, InsertPosition.BEFORE_END);
    this._topCommentedView.hide();
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

      if (!isOnline()) {
        toast('Can\'t load comment offline');
      }
    }

    if (this._filmModal !== null) {
      //?????????????????? ?????? ?????????? ?????? ???????????????? ???????????? ???????????????????? ????????
      //???????????????? ?????????????????? ?????????? ??????????????????????
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

  _updateFilmListsExtra() {
    const topRated = this._moviesModel.getTopRated();
    const topCommented = this._moviesModel.getTopCommented();

    this._topRatedView.removeFilmCards();
    if (topRated.length > 0) {
      topRated.forEach((film) => this._renderExtraFilmCard(film, this._topRatedView));
      this._topRatedView.show();
    } else {
      this._topRatedView.hide();
    }

    this._topCommentedView.removeFilmCards();
    if (topCommented.length > 0) {
      topCommented.forEach((film) => this._renderExtraFilmCard(film, this._topCommentedView));
      this._topCommentedView.show();
    } else {
      this._topCommentedView.hide();
    }
  }

  _renderExtraFilmCard(filmData, containerView) {
    const filmCard = new FilmCardView(filmData, this._handleViewAction);
    filmCard.setOpenModalHandler(() => this._openFilmModal(filmCard.film));
    filmCard.setControlClickHandler(this._handleViewAction);
    renderElement(containerView.getFilmContainer(), filmCard, InsertPosition.BEFORE_END);
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

    this._clearFilmList({ resetRenderedCardsCount: true });
    this._renderFilmCards(this._filmData.slice(0, this._renderedFilmCardsCount));
    this._showMoreButton = new ShowMoreButtonView();
    this._renderShowMore();
  }

  _handleViewAction(userAction, update) {
    switch (userAction) {
      case UserAction.UPDATE_FILM:
        this._filmControlClickHandler(update);
        break;
      case UserAction.ADD_COMMENT:
        this._restService.addComment(update)
          .then((movie) => this._moviesModel.addComment(UpdateType.PATCH, movie))
          .catch(() => {
            if (this._filmModal !== null) {
              this._filmModal.onAddCommentError();
            }
            if (!isOnline()) {
              toast('Can\'t add comment offline');
            }
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._restService.deleteComment(update.commentId)
          .then(() => this._moviesModel.deleteComment(UpdateType.PATCH, update))
          .catch(() => {
            if (this._filmModal !== null) {
              this._filmModal.onDeleteCommentError(update.commentId);
            }

            if (!isOnline()) {
              toast('Can\'t delete comment offline');
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
    this._updateFilmListsExtra();
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
