export class Provider {
  constructor(api, storage) {
    this._api = api;
    this._storage = storage;
  }

  getMovies() {
    return this._api.getMovies();
  }

  getCommentsForMovie() {
    return this._api.getCommentsForMovie();
  }

  updateMovie() {
    return this._api.updateMovie();
  }

  addComment() {
    return this._api.addComment();
  }

  deleteComment() {
    return this._api.deleteComment();
  }
}
