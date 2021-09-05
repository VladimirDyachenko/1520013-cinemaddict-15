import StatisticView from '../view/statistic/statistic.js';
import { InsertPosition, renderElement } from '../utils/dom.js';

export default class Statistic {
  constructor(containerElement, moviesModel, siteNavModel) {
    this._containerElement = containerElement;

    this._moviesModel = moviesModel;
    this._siteNavModel = siteNavModel;
  }

  init() {
    this._films = this._moviesModel.movies;
    this._filmsFilterData = this._moviesModel.getFiltredMovies();
    this._statisticView = new StatisticView(this._films);
    this._renderStatistic();
  }

  _renderStatistic() {
    renderElement(this._containerElement, this._statisticView, InsertPosition.BEFORE_END);
  }

  destroy() {
    if (this._statisticView) {
      this._statisticView.getElement().remove();
      this._statisticView.removeElement();
    }
  }
}
