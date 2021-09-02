import StatisticPresentor from './presenter/statistic.js';
import FilmListPresenter from './presenter/film-list.js';
import SharedPresentor from './presenter/shared.js';
import MoviesModel from './model/movies.js';
import { getTestData } from './mock/films.js';
import { getRandomPositiveInteger } from './utils/test-data.js';
import SiteNavModel from './model/site-nav.js';
import { Pages, UpdateType } from './const.js';

const films = getTestData();
const mainElement = document.querySelector('.main');
const filmsCount = getRandomPositiveInteger(100000, 1500000);

const moviesModel = new MoviesModel();
moviesModel.movies = films;
const siteNavModel = new SiteNavModel();

const sharedPresentor = new SharedPresentor(mainElement, filmsCount, moviesModel, siteNavModel);
const staticPagePresentor = new StatisticPresentor(mainElement, moviesModel, siteNavModel);
const movieListPresenter = new FilmListPresenter(mainElement, moviesModel, siteNavModel);

sharedPresentor.init();

const renderStatsPage = () => {
  siteNavModel.setActivePage(UpdateType.MAJOR, Pages.STATISTIC);
  staticPagePresentor.init();
};

const renderMainPage = () => {
  siteNavModel.setActivePage(UpdateType.MAJOR, Pages.All);
  movieListPresenter.init();
};

const setPage = (isStatPage = false) => isStatPage ? renderStatsPage() : renderMainPage();

setPage();
