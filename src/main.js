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
const statisticPagePresentor = new StatisticPresentor(mainElement, moviesModel);
const movieListPresenter = new FilmListPresenter(mainElement, moviesModel, siteNavModel);

sharedPresentor.init();

siteNavModel.subscribe((_, newPage) => {
  if (newPage === Pages.STATISTIC) {
    movieListPresenter.destroy();
    statisticPagePresentor.init();
  } else {
    statisticPagePresentor.destroy();
    movieListPresenter.init();
  }
});

siteNavModel.setActivePage(UpdateType.MAJOR, Pages.All);
