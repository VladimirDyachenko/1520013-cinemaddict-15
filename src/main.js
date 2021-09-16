import StatisticPresentor from './presenter/statistic.js';
import FilmListPresenter from './presenter/film-list.js';
import SharedPresentor from './presenter/shared.js';
import MoviesModel from './model/movies.js';
import { getRandomPositiveInteger } from './utils/test-data.js';
import SiteNavModel from './model/site-nav.js';
import { END_POINT, AUTHORIZATION, Pages, UpdateType } from './const.js';
import RestService from './rest-service.js';

const restService = new RestService(END_POINT, AUTHORIZATION);

const mainElement = document.querySelector('.main');
const filmsCount = getRandomPositiveInteger(100000, 1500000);

const moviesModel = new MoviesModel();
const siteNavModel = new SiteNavModel();

const sharedPresentor = new SharedPresentor(mainElement, filmsCount, moviesModel, siteNavModel);
const statisticPagePresentor = new StatisticPresentor(mainElement, moviesModel);
const movieListPresenter = new FilmListPresenter(mainElement, moviesModel, siteNavModel, restService);

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


restService.getMovies()
  .then((movies) => moviesModel.setMovies(UpdateType.INIT, movies))
  .catch(() => moviesModel.setMovies(UpdateType.INIT, []));

window.addEventListener('load', () => window.navigator.serviceWorker.register('/sw.js'));
