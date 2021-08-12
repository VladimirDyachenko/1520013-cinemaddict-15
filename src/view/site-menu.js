import { createElement } from '../utils/utils.js';

const getSiteMenuTemplate = (filterData) => (`<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filterData.watchList.length}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filterData.historyList.length}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filterData.favoriteList.length}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class SiteMenu {
  constructor(filterData) {
    this._element = null;
    this._filterData = filterData;
  }

  getTemplate() {
    return getSiteMenuTemplate(this._filterData);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
