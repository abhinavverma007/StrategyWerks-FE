import {TestBed} from '@angular/core/testing';

import {MoviesService} from './movies.service';
import {HttpClientModule} from '@angular/common/http';
import {Movies} from '../models/movies.model';

describe('MoviesService', () => {
  let service: MoviesService;

  const mockMovies = [
    {
      imdb: {
        rating: 5
      },
      title: 'ff',
      year: 3331,
        runtime: 250,
        genres: ['D','F','G'],
        awards: {
          text: '2 win'
        }
    },
    {
      imdb: {
        rating: 4
      },
      title: 'ff',
      year: 3321,
        runtime: 250,
        genres: ['D','F','G'],
        awards: {
          text: '2 win'
        }
    },
  ] as Movies[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MoviesService],
      imports: [HttpClientModule],
    });
    service = TestBed.inject(MoviesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
