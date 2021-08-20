import UserProfileView from '../view/user-profile.js';
import FooterStatisticView from '../view/footer-statistic.js';
import { InsertPosition, renderElement } from '../utils/dom.js';

export default class Shared {
  constructor(totalFilms, filmsWatched) {
    this._headerElement = document.querySelector('.header');
    this._footerElement = document.querySelector('.footer');
    this._totalFilms = totalFilms;
    this._filmsWatched = filmsWatched;
  }

  init() {
    renderElement(this._headerElement, new UserProfileView(this._filmsWatched), InsertPosition.BEFORE_END);
    renderElement(this._footerElement, new FooterStatisticView(this._totalFilms), InsertPosition.BEFORE_END);
  }
}
