import SiteMenuView from '../view/site-menu.js';
import SortListView from '../view/films/sort.js';
import FilmListView from '../view/films/films-list.js';
import FilmCardView from '../view/films/film-card.js';
import ShowMoreButtonView from '../view/films/show-more-button.js';
import FilmListExtraView from '../view/films/films-list-extra.js';
import FilmModalView from '../view/films/film-modal.js';
import { renderElement, InsertPosition } from '../utils/dom.js';

const FILMS_PER_ROW = 5;

export default class FilmList {
  constructor(listContainer, filmData, sortedFilmData) {
    this._listContainer = listContainer;
    this._filmData = filmData;
    this._sortedFilmData = sortedFilmData;

    //Views
    this._siteMenu = new SiteMenuView(this._sortedFilmData);
    this._sortList = new SortListView();
    this._filmList = new FilmListView();
    this._showMoreButton = new ShowMoreButtonView();
    this._filmModal = null;

    //Other
    this._lastRenderedFilmCardIndex = 0;
    this._limit = FILMS_PER_ROW;

    //Event handlers
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
    this._showMoreClickHandler = this._showMoreClickHandler.bind(this);
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
  }

  _renderFilmList() {
    renderElement(this._listContainer, this._filmList, InsertPosition.BEFORE_END);
  }

  _renderFilmCardsRow() {
    for(this._lastRenderedFilmCardIndex; this._lastRenderedFilmCardIndex < this._limit; this._lastRenderedFilmCardIndex++) {
      const filmCard = new FilmCardView(this._filmData[this._lastRenderedFilmCardIndex]);
      filmCard.setOpenModalHandler(() => this._openFilmModal(filmCard.getFilmData()));

      renderElement(this._filmList.getFilmContainer(), filmCard, InsertPosition.BEFORE_END);
    }

    this._limit = this._lastRenderedFilmCardIndex + FILMS_PER_ROW < this._filmData.length ?
      this._lastRenderedFilmCardIndex + FILMS_PER_ROW :
      this._filmData.length;

    return this._filmData.length - this._lastRenderedFilmCardIndex;
  }

  _renderShowMore() {
    renderElement(this._filmList.getElement(), this._showMoreButton, InsertPosition.BEFORE_END);
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
      this._showMoreButton.getElement().remove();
      this._showMoreButton.removeElement();
    }
  }

  _openFilmModal(filmData) {
    if (this._filmModal !== null) {
      document.removeEventListener('keydown', this._onEscKeyDownHandler);
      this._filmModal.removeElement();
      this._filmModal = null;
    }

    this._filmModal = new FilmModalView(filmData);
    document.addEventListener('keydown', this._onEscKeyDownHandler);
    this._filmModal.setCloseButtonClick(() => this._onModalCloseClick());
    this._renderFilmModal();
  }

  _closeFilmModal() {
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
    this._filmModal.removeElement();
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
}
