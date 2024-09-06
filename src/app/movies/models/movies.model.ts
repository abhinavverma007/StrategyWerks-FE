
export interface Awards {
  wins: number;
  nominations: number;
  text: string;
}

export interface Imdb {
  rating: number;
  votes: number;
  id: number;
}

export interface Tomatoes {
  viewer: {
    rating: number;
    numReviews: number;
    meter: number;
  };
  production: string;
  lastUpdated: Date;
}


export class Movies {
  id: string;
  plot: string;
  genres: string[];
  runtime: number;
  rated: string;
  cast: string[];
  num_mflix_comments: number;
  poster: string;
  title: string;
  fullplot: string;
  countries: string[];
  released: Date;
  directors: string[];
  writers: string[];
  awards: Awards;
  lastupdated: Date;
  year: number;
  imdb: Imdb;
  type: string;
  tomatoes: Tomatoes;

  constructor(data: Partial<Movies>) {
    this.id = data.id || '';
    this.plot = data.plot || '';
    this.genres = data.genres || [];
    this.runtime = data.runtime || 0;
    this.rated = data.rated || '';
    this.cast = data.cast || [];
    this.num_mflix_comments = data.num_mflix_comments || 0;
    this.poster = data.poster || '';
    this.title = data.title || '';
    this.fullplot = data.fullplot || '';
    this.countries = data.countries || [];
    this.released = data.released || new Date();
    this.directors = data.directors || [];
    this.writers = data.writers || [];
    this.awards = data.awards || { wins: 0, nominations: 0, text: '' };
    this.lastupdated = data.lastupdated || new Date();
    this.year = data.year || 0;
    this.imdb = data.imdb || { rating: 0, votes: 0, id: 0 };
    this.type = data.type || '';
    this.tomatoes = data.tomatoes || {
      viewer: { rating: 0, numReviews: 0, meter: 0 },
      production: '',
      lastUpdated: new Date(),
    };
  }
}
