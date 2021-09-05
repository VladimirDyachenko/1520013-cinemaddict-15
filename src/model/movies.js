import dayjs from 'dayjs';
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
    return {...this._filtredMovies };
  }

  addComment(updateType, newComment) {
    const show = this._movies.find((movie) => movie.id === newComment.movieId);

    show.comments.push({
      emote: newComment.selectedEmoji,
      text: newComment.commentText,
      date: dayjs().toString(),
      author: 'Jon Doe',
    });

    this.updateMovie(updateType, show);
  }

  deleteComment(updateType, { movieId, commentId }) {
    const show = this._movies.find((movie) => movie.id === movieId);

    show.comments = show.comments.filter((comment) => comment.id !== commentId);

    this.updateMovie(updateType, show);
  }
}
