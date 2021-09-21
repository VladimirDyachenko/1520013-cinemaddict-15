import SiteMenuView from '../view/site-menu.js';
import UserProfileView from '../view/user-profile.js';
import FooterStatisticView from '../view/footer-statistic.js';
import { InsertPosition, renderElement } from '../utils/dom.js';
import { UpdateType } from '../const.js';

export default class Shared {
  constructor(siteNavParent, moviesModel, siteNavModel) {
    this._siteNavParent = siteNavParent;
    this._moviesModel = moviesModel;
    this._siteNavModel = siteNavModel;
    this._headerElement = document.querySelector('.header');
    this._footerElement = document.querySelector('.footer');
    this._filmsWatched = this._moviesModel.getFilteredMovies().historyList.length;

    const activePage = this._siteNavModel.getActivePage();
    const filterData = this._moviesModel.getFilteredMovies();
    this._siteMenuView = new SiteMenuView({activePage, filterData});
    this._footerStatisticView = new FooterStatisticView(0);
    this._userProfileView = new UserProfileView(0);

    this._handleMovieModelUpdate = this._handleMovieModelUpdate.bind(this);
    this._handleSiteNavModelUpdate = this._handleSiteNavModelUpdate.bind(this);
    this._handleSiteNavAction = this._handleSiteNavAction.bind(this);
  }

  init() {
    renderElement(this._headerElement, this._userProfileView, InsertPosition.BEFORE_END);
    renderElement(this._siteNavParent, this._siteMenuView, InsertPosition.AFTER_BEGIN);
    renderElement(this._footerElement, this._footerStatisticView, InsertPosition.BEFORE_END);

    this._moviesModel.subscribe(this._handleMovieModelUpdate);
    this._siteNavModel.subscribe(this._handleSiteNavModelUpdate);
    this._siteMenuView.setLinkClickHandler(this._handleSiteNavAction);
  }

  _handleMovieModelUpdate() {
    const activePage = this._siteNavModel.getActivePage();
    const filterData = this._moviesModel.getFilteredMovies();
    const watchedCount = this._moviesModel.getFilteredMovies().historyList.length;
    this._siteMenuView.updateData({ activePage, filterData }, true);
    this._userProfileView.updateData( { watched: watchedCount }, true);
  }

  _handleSiteNavModelUpdate() {
    const activePage = this._siteNavModel.getActivePage();
    const filterData = this._moviesModel.getFilteredMovies();
    this._siteMenuView.updateData({ activePage, filterData }, true);
  }

  _handleSiteNavAction(newPage){
    this._siteNavModel.setActivePage(UpdateType.MAJOR, newPage);
  }

  updateMoviesCount(count) {
    this._footerStatisticView.updateCount(count);
  }
}
