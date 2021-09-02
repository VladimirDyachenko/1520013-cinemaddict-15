import SmartView from './smart-view.js';
import { Pages } from '../const.js';

const getSiteMenuTemplate = ({ activePage, filterData }) => (`<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="${Pages.All}" class="main-navigation__item ${activePage === Pages.All ? 'main-navigation__item--active' : ''}">All movies</a>
    <a href="${Pages.WATCHLIST}" class="main-navigation__item ${activePage === Pages.WATCHLIST ? 'main-navigation__item--active' : ''}">Watchlist <span class="main-navigation__item-count">${filterData.watchList.length}</span></a>
    <a href="${Pages.HISTORY}" class="main-navigation__item ${activePage === Pages.HISTORY ? 'main-navigation__item--active' : ''}">History <span class="main-navigation__item-count">${filterData.historyList.length}</span></a>
    <a href="${Pages.FAVORITE}" class="main-navigation__item ${activePage === Pages.FAVORITE ? 'main-navigation__item--active' : ''}">Favorites <span class="main-navigation__item-count">${filterData.favoriteList.length}</span></a>
  </div>
  <a href="${Pages.STATISTIC}" class="main-navigation__additional ${activePage === Pages.STATISTIC ? 'main-navigation__item--active' : ''}">Stats</a>
  </nav>`
);

export default class SiteMenu extends SmartView {
  constructor({ activePage, filterData }) {
    super();
    this._data = { activePage, filterData };
    this._callbacks = {};
    this._linkClickHandler = this._linkClickHandler.bind(this);
  }

  getTemplate() {
    return getSiteMenuTemplate(this._data);
  }

  restoreHandlers() {
    this.setLinkClickHandler(this._callbacks.linkClick);
  }

  _linkClickHandler(event) {
    if (event.target.tagName !== 'A') {
      return;
    }

    this._callbacks.linkClick(event.target.hash);
  }

  setLinkClickHandler(callback) {
    this._callbacks.linkClick = callback;
    [...this.getElement().querySelectorAll('a')]
      .forEach((element) => {
        element.addEventListener('click', this._linkClickHandler);
      });
  }
}
