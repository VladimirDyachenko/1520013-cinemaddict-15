import MoviesModel from './model/movies.js';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};


export default class RestService {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: 'movies'})
      .then(RestService.toJSON)
      .then((movies) => movies.map(MoviesModel.adaptToClient));
  }

  getCommentsForMovie(movieId) {
    return this._load({url: `comments/${movieId}`})
      .then(RestService.toJSON)
      .then((comments) => comments.map(MoviesModel.adaptCommentToClient));
  }

  updateMovie(movie) {
    return this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(RestService.toJSON)
      .then(MoviesModel.adaptToClient);
  }

  addComment(comment) {
    return this._load({
      url: `comments/${comment.movieId}`,
      method: Method.POST,
      body: JSON.stringify(MoviesModel.adaptCommentToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(RestService.toJSON)
      .then((res) => MoviesModel.adaptToClient(res.movie));
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(RestService.checkStatus)
      .catch(RestService.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static catchError(error) {
    throw error;
  }

  static toJSON(response) {
    return response.json();
  }
}
