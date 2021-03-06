import StatisticPresentor from './presenter/statistic.js';
import FilmListPresenter from './presenter/film-list.js';
import SharedPresentor from './presenter/shared.js';
import MoviesModel from './model/movies.js';
import SiteNavModel from './model/site-nav.js';
import { END_POINT, AUTHORIZATION, Pages, UpdateType, LOCAL_STORE_KEY, OFFLINE_PREFIX } from './const.js';
import RestService from './api/rest-service.js';
import { Provider } from './api/provider.js';
import { Store } from './api/store.js';
import { isOnline } from './utils/utils.js';

const restService = new RestService(END_POINT, AUTHORIZATION);
const store = new Store(LOCAL_STORE_KEY, localStorage);
const apiProvider = new Provider(restService, store);

const mainElement = document.querySelector('.main');

const moviesModel = new MoviesModel();
const siteNavModel = new SiteNavModel();

const sharedPresentor = new SharedPresentor(mainElement, moviesModel, siteNavModel);
const statisticPagePresentor = new StatisticPresentor(mainElement, moviesModel);
const movieListPresenter = new FilmListPresenter(mainElement, moviesModel, siteNavModel, apiProvider);

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


apiProvider.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
    sharedPresentor.updateMoviesCount(movies.length);
  })
  .catch(() => moviesModel.setMovies(UpdateType.INIT, []));

const updateTitle = () => {
  isOnline() ? document.title = document.title.replace(`${OFFLINE_PREFIX}`, '') : document.title += OFFLINE_PREFIX;
};

window.addEventListener('load', () => {
  window.navigator.serviceWorker.register('./sw.js');
  updateTitle();
});

window.addEventListener('online', () => {
  updateTitle();
  if (apiProvider.getIsNeedSync()) {
    apiProvider.sync();
  }
});

window.addEventListener('offline', () => updateTitle());
