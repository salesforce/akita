export const movies = {
  entities: {
    genres: {
      '1': {
        id: 1,
        name: 'Action'
      },
      '2': {
        id: 2,
        name: 'Adventure'
      },
      '3': {
        id: 3,
        name: 'Crime'
      },
      '4': {
        id: 4,
        name: 'Drama'
      },
      '5': {
        id: 5,
        name: 'Mystery'
      },
      '6': {
        id: 6,
        name: 'Sci-Fi'
      }
    },
    actors: {
      '288': {
        id: 288,
        name: 'Christian Bale'
      },
      '323': {
        id: 323,
        name: 'Michael Caine'
      },
      '5132': {
        id: 5132,
        name: 'Heath Ledger'
      },
      '413168': {
        id: 413168,
        name: 'Hugh Jackman'
      },
      '3822462': {
        id: 3822462,
        name: 'Rila Fukushima'
      },
      '5148840': {
        id: 5148840,
        name: 'Tao Okamoto'
      }
    },
    movies: {
      '468569': {
        id: 468569,
        title: 'The Dark Knight',
        genres: [1, 3, 4],
        actors: [288, 5132, 323]
      },
      '482571': {
        id: 482571,
        title: 'The Prestige',
        genres: [4, 5, 6],
        actors: [413168, 288, 323]
      },
      '1430132': {
        id: 1430132,
        title: 'The Wolverine',
        genres: [1, 2, 6],
        actors: [413168, 5148840, 3822462]
      }
    }
  },
  result: [468569, 482571, 1430132]
};
