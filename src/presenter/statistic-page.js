import SiteMenuView from '../view/site-menu.js';
import StatisticView from '../view/statistic/statistic.js';
import { InsertPosition, renderElement } from '../utils/dom.js';

export default class Statistic {
  constructor(containerElement, moviesModel) {
    this._moviesModel = moviesModel;
    this._containerElement = containerElement;
    this._films = this._moviesModel.movies;
    this._filmsFilterData = this._moviesModel.getFiltredMovies();
    this._siteMenuView = new SiteMenuView(this._filmsFilterData);
    this._statisticView = new StatisticView(this._films);
  }

  init() {
    this._renderSiteNav();
    this._renderStatistic();
  }

  _renderSiteNav() {
    renderElement(this._containerElement, this._siteMenuView, InsertPosition.AFTER_BEGIN);
  }

  _renderStatistic() {
    renderElement(this._containerElement, this._statisticView, InsertPosition.BEFORE_END);
  }
}
