import StatisticView from '../view/statistic/statistic.js';
import { InsertPosition, renderElement } from '../utils/dom.js';

export default class Statistic {
  constructor(containerElement, moviesModel) {
    this._containerElement = containerElement;

    this._moviesModel = moviesModel;
  }

  init() {
    this._films = this._moviesModel.movies;
    this._statisticView = new StatisticView(this._films);
    this._renderStatistic();
    this._statisticView.init();
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
