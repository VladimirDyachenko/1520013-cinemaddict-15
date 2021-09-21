import AbstractSubscriber from './abstract-observer.js';

export default class MoviesModel extends AbstractSubscriber {
  constructor() {
    super();
    this._movies = [];
    this._filtredMovies = {
      watchList: [],
      historyList: [],
      favoriteList: [],
    };
    this._topCommented = [];
    this._topRated = [];
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

    this._computeTop();
  }

  setMovies(updateType, movies) {
    this.movies = movies;

    this._notify(updateType, [...this._movies]);
  }

  get movies() {
    return [...this._movies];
  }

  getTopCommented() {
    return [...this._topCommented];
  }

  getTopRated() {
    return [...this._topRated];
  }

  _computeTop() {
    const moviesWithComments = [];
    const moviesWithRating = [];

    this._movies.forEach((movie) => {
      if (movie.comments.length !== 0) {
        moviesWithComments.push(movie);
      }

      if (movie.totalRating !== 0) {
        moviesWithRating.push(movie);
      }
    });

    moviesWithComments.sort((a, b) => b.comments.length - a.comments.length);
    moviesWithRating.sort((a, b) => b.totalRating - a.totalRating);

    this._topCommented = this._getTopElements(moviesWithComments, 'comments', 2);
    this._topRated = this._getTopElements(moviesWithRating, 'totalRating', 2);
  }

  _getTopElements(array, key, amount) {
    const copy = [...array];

    if (copy.length <= amount) {
      return copy;
    }

    //if all items equal we should get random elements from array
    if (copy[0][key] === copy[copy.length - 1][key]) {
      return copy.sort(() => Math.random() - 0.5).slice(0, amount);
    }

    return copy.slice(0, amount);
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

  getFilteredMovies() {
    return {...this._filtredMovies };
  }

  addComment(updateType, newMovie) {
    const show = this._movies.find((movie) => movie.id === newMovie.id);

    show.comments = newMovie.comments;

    this.updateMovie(updateType, show);
  }

  deleteComment(updateType, { movieId, commentId }) {
    const show = this._movies.find((movie) => movie.id === movieId);

    show.comments = show.comments.filter((comment) => comment !== commentId);

    this.updateMovie(updateType, show);
  }

  static adaptToClient(movie) {
    const adaptedTask = Object.assign(
      {},
      movie,
      {
        title: movie['film_info']['title'],
        alternativeTitle: movie['film_info']['alternative_title'],
        totalRating: movie['film_info']['total_rating'],
        poster: movie['film_info']['poster'],
        ageRating: movie['film_info']['age_rating'],
        director: movie['film_info']['director'],
        writers: movie['film_info']['writers'],
        actors: movie['film_info']['actors'],
        release: {
          date: movie['film_info']['release']['date'],
          country: movie['film_info']['release']['release_country'],
        },
        runtime: movie['film_info']['runtime'],
        genre: movie['film_info']['genre'],
        description: movie['film_info']['description'],
        watchlist: movie['user_details']['watchlist'],
        alreadyWatched: movie['user_details']['already_watched'],
        watchingDate: movie['user_details']['watching_date'],
        favorite: movie['user_details']['favorite'],
      },
    );

    delete adaptedTask['film_info'];
    delete adaptedTask['user_details'];

    return adaptedTask;
  }

  static adaptToServer(movie) {
    const adaptedTask = {
      'film_info': {
        'release': {},
      },
      'user_details': {},
    };

    adaptedTask['id'] = movie.id;
    adaptedTask['comments'] = movie.comments;
    adaptedTask['film_info']['title'] = movie.title;
    adaptedTask['film_info']['alternative_title'] = movie.alternativeTitle;
    adaptedTask['film_info']['total_rating'] = movie.totalRating;
    adaptedTask['film_info']['poster'] = movie.poster;
    adaptedTask['film_info']['age_rating'] = movie.ageRating;
    adaptedTask['film_info']['director'] = movie.director;
    adaptedTask['film_info']['writers'] = movie.writers;
    adaptedTask['film_info']['actors'] = movie.actors;
    adaptedTask['film_info']['release']['date'] = movie.release.date;
    adaptedTask['film_info']['release']['release_country'] = movie.release.country;
    adaptedTask['film_info']['runtime'] = movie.runtime;
    adaptedTask['film_info']['genre'] = movie.genre;
    adaptedTask['film_info']['description'] = movie.description;
    adaptedTask['user_details']['watchlist'] = movie.watchlist;
    adaptedTask['user_details']['already_watched'] = movie.alreadyWatched;
    adaptedTask['user_details']['favorite'] = movie.favorite;
    adaptedTask['user_details']['watching_date'] = movie.watchingDate;

    return adaptedTask;
  }

  static adaptCommentToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        emote: comment['emotion'],
        text: comment['comment'],
      },
    );

    delete adaptedComment['emotion'];
    delete adaptedComment['comment'];

    return adaptedComment;
  }

  static adaptCommentToServer(comment) {
    const adaptedComment = {};
    adaptedComment['comment'] = comment.commentText;
    adaptedComment['emotion'] = comment.selectedEmoji;

    return adaptedComment;
  }
}
