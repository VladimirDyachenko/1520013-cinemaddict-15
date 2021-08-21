import dayjs from 'dayjs';

export const sortByReleaseDate = (filmA, filmB) => dayjs(filmB.release.date).diff(dayjs(filmA.release.date));

export const sortByRating = (filmA, filmB) => parseFloat(filmB.totalRating) - parseFloat(filmA.totalRating);
