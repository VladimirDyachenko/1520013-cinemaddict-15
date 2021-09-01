import AbstractSubscriber from './abstract-observer.js';

export default class MoviesModel extends AbstractSubscriber {
  constructor() {
    super();
    this._movies = [];
    this._filtredMovies = {};
  }

  set movies(movies) {
    this._movies = movies;

    const watchList = [];
    const historyList = [];
    const favoriteList = [];

    this._movies.forEach((film) => {
      if (film.watchlist) {
        watchList.push(film);
      }

      if (film.alreadyWatched) {
        historyList.push(film);
      }

      if (film.favorite) {
        favoriteList.push(film);
      }
    });

    this._filtredMovies = {
      watchList,
      historyList,
      favoriteList,
    };
  }

  get movies() {
    return [...this._movies];
  }

  updateMovie(updateType, newMovie) {
    const index = this._movies.findIndex((movie) => movie.id === newMovie.id);

    if (index === -1) {
      throw new Error(`No movie with ${newMovie.id} found`);
    }

    this.movies = [
      ...this._movies.slice(0, index),
      newMovie,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, newMovie);
  }

  getFiltredMovies() {
    return { ...this._filtredMovies };
  }
}
