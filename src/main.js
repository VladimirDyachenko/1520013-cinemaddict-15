import StatisticPresentor from './presenter/statistic-page.js';
import FilmListPagePresenter from './presenter/movie-page.js';
import SharedPresentor from './presenter/shared.js';
import { getTestData } from './mock/films.js';
import { getRandomPositiveInteger } from './utils/test-data.js';

const [films, filterData] = getTestData();
const mainElement = document.querySelector('.main');
const filmsCount = getRandomPositiveInteger(100000, 1500000);

const sharedPresentor = new SharedPresentor(filmsCount, filterData.historyList.length);
sharedPresentor.init();

const renderStatsPage = () => {
  const staticPagePresentor = new StatisticPresentor(mainElement, films, filterData);
  staticPagePresentor.init();
};

const renderMainPage = () => {
  const movieListPresenter = new FilmListPagePresenter(mainElement, films, filterData);
  movieListPresenter.init();
};

const setPage = (isStatPage = false) => isStatPage ? renderStatsPage() : renderMainPage();

setPage();
