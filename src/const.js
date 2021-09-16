export const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

export const AUTHORIZATION = 'Basic my_git_hub_password_qwerty';

export const sortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const FilmControlAction = {
  watchlist: 'toggleWatchList',
  watched: 'toggleWatched',
  favorite: 'toggleFavotite',
};

export const FILMS_PER_ROW = 5;

export const RankTrie = {
  0: '',
  10: 'Novice',
  20: 'Fan',
  21: 'Movie buff',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const Pages = {
  All: '#all',
  WATCHLIST: '#watchlist',
  HISTORY: '#history',
  FAVORITE: '#favorites',
  STATISTIC: '#stats',
};

export const EmptyMessageByCurrentPage = {
  [Pages.All]: 'There are no movies in our database',
  [Pages.WATCHLIST]: 'There are no movies to watch now',
  [Pages.HISTORY]: 'There are no watched movies now',
  [Pages.FAVORITE]: 'There are no favorite movies now',
  LOADING: 'Loading...',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const TimeDelta = {
  ALL_TIME: 'all',
  TODAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const LOCAL_STORE_KEY = 'cinemaddict';
