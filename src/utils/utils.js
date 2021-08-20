import { RankTrie } from '../const.js';

export const getRuntimeString = (runtimeInMinutes) => {
  const hours = Math.floor(runtimeInMinutes / 60);
  const minutes = runtimeInMinutes % 60;

  return hours > 0 ?`${hours}h ${minutes}m` : `${minutes}m`;
};

export const getUserRank = (watchedFilmAmount) => {
  const tires = Object.entries(RankTrie);
  for(const tire of tires) {
    if (watchedFilmAmount <= tire[0]) {
      return tire[1];
    }
  }

  return tires[tires.length - 1][1];
};
