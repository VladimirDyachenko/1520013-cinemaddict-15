import SiteMenuView from '../view/site-menu.js';
import UserProfileView from '../view/user-profile.js';
import FooterStatisticView from '../view/footer-statistic.js';
import { InsertPosition, renderElement } from '../utils/dom.js';
import { UpdateType } from '../const.js';

export default class Shared {
  constructor(siteNavParent, totalFilms, moviesModel, siteNavModel) {
    this._siteNavParent = siteNavParent;
    this._moviesModel = moviesModel;
    this._siteNavModel = siteNavModel;
    this._headerElement = document.querySelector('.header');
    this._footerElement = document.querySelector('.footer');
    this._totalFilms = totalFilms;
    this._filmsWatched = this._moviesModel.getFiltredMovies().historyList.length;

    const activePage = this._siteNavModel.getActivePage();
    const filterData = this._moviesModel.getFiltredMovies();
    this._siteMenuView = new SiteMenuView({activePage, filterData});

    this._handleMovieModelUpdate = this._handleMovieModelUpdate.bind(this);
    this._handleSiteNavModelUpdate = this._handleSiteNavModelUpdate.bind(this);
    this._handleSiteNavAction = this._handleSiteNavAction.bind(this);
  }

  init() {
    renderElement(this._headerElement, new UserProfileView(this._filmsWatched), InsertPosition.BEFORE_END);
    renderElement(this._siteNavParent, this._siteMenuView, InsertPosition.AFTER_BEGIN);
    renderElement(this._footerElement, new FooterStatisticView(this._totalFilms), InsertPosition.BEFORE_END);

    this._moviesModel.subscribe(this._handleMovieModelUpdate);
    this._siteNavModel.subscribe(this._handleSiteNavModelUpdate);
    this._siteMenuView.setLinkClickHandler(this._handleSiteNavAction);
  }

  _handleMovieModelUpdate() {
    const activePage = this._siteNavModel.getActivePage();
    const filterData = this._moviesModel.getFiltredMovies();
    this._siteMenuView.updateData({ activePage, filterData }, true);
  }

  _handleSiteNavModelUpdate() {
    const activePage = this._siteNavModel.getActivePage();
    const filterData = this._moviesModel.getFiltredMovies();
    this._siteMenuView.updateData({ activePage, filterData }, true);
  }

  _handleSiteNavAction(newPage){
    this._siteNavModel.setActivePage(UpdateType.MAJOR, newPage);
  }
}
