import StatisticPresentor from './presenter/statistic-page.js';
import FilmListPresenter from './presenter/film-list.js';
import SharedPresentor from './presenter/shared.js';
import MoviesModel from './model/movies.js';
import { getTestData } from './mock/films.js';
import { getRandomPositiveInteger } from './utils/test-data.js';

const films = getTestData();
const mainElement = document.querySelector('.main');
const filmsCount = getRandomPositiveInteger(100000, 1500000);

const moviesModel = new MoviesModel();
moviesModel.movies = films;

const sharedPresentor = new SharedPresentor(filmsCount, moviesModel);
sharedPresentor.init();

const renderStatsPage = () => {
  const staticPagePresentor = new StatisticPresentor(mainElement, moviesModel);
  staticPagePresentor.init();
};

const renderMainPage = () => {
  const movieListPresenter = new FilmListPresenter(mainElement, moviesModel);
  movieListPresenter.init();
};

const setPage = (isStatPage = false) => isStatPage ? renderStatsPage() : renderMainPage();

setPage();
