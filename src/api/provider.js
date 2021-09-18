import MoviesModel from '../model/movies.js';
import { isOnline } from '../utils/utils.js';

const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});


export class Provider {
  constructor(api, storage) {
    this._api = api;
    this._storage = storage;
    this._isNeedSync = false;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoviesModel.adaptToServer));
          this._storage.setItems(items);
          return movies;
        });
    }

    const storeMovies = Object.values(this._storage.getItems());
    return Promise.resolve(storeMovies.map(MoviesModel.adaptToClient));
  }

  getCommentsForMovie(movieId) {
    if (isOnline()) {
      return this._api.getCommentsForMovie(movieId);
    }

    return Promise.reject(new Error('Get comments failed'));
  }

  updateMovie(movie) {
    if (isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._storage.setItems(updatedMovie.id, MoviesModel.adaptToServer(updatedMovie));
          return updatedMovie;
        });
    }

    this._isNeedSync = true;
    this._storage.setItem(movie.id, MoviesModel.adaptToServer(movie));
    return Promise.resolve(movie);
  }

  addComment(comment) {
    if (isOnline()) {
      return this._api.addComment(comment);
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(commentID) {
    if (isOnline()) {
      return this._api.deleteComment(commentID);
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  getIsNeedSync() {
    return this._isNeedSync;
  }

  sync() {

    if (isOnline()) {
      const storeMovies = Object.values(this._storage.getItems());

      return this._api.sync(storeMovies)
        .then((response) => {
          const items = createStoreStructure([...response.updated]);
          this._storage.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
