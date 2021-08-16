
export const getRuntimeString = (runtimeInMinutes) => {
  const hours = Math.floor(runtimeInMinutes / 60);
  const minutes = runtimeInMinutes % 60;

  return hours > 0 ?`${hours}h ${minutes}m` : `${minutes}m`;
};

const RankTrie = {
  0: '',
  10: 'Novice',
  20: 'Fan',
  21: 'Movie buff',
};

export const getUserRank = (watchedFilmAmount) => {
  for(const tire of Object.entries(RankTrie)) {
    if (watchedFilmAmount <= tire[0]) {
      return tire[1];
    }
  }
};
