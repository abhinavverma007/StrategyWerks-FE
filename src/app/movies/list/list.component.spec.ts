import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {By} from '@angular/platform-browser';

import {Movies} from '../models/movies.model';
import {MoviesService} from '../service/movies.service';
import {MoviesListComponent} from './list.component';
import {of, throwError} from 'rxjs';
import {Count} from '../models/count.model';

describe('ListComponent', () => {
  let component: MoviesListComponent;
  let fixture: ComponentFixture<MoviesListComponent>;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;

  let viewportMock: CdkVirtualScrollViewport;

  const mockmovies = [
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
        rating: 6
      },
      title: 'ffff',
      year: 3332,
        runtime: 150,
        genres: ['D1','F1','G1'],
        awards: {
          text: '12 win'
        }
    },
  ] as Movies[];

  beforeEach(async () => {
    moviesServiceSpy = jasmine.createSpyObj('movieservice', [
      'getMoviesCount',
      'getMovies',
    ]);
    await TestBed.configureTestingModule({
      declarations: [MoviesListComponent],
      providers: [
        {
          provide: MoviesService,
          useValue: moviesServiceSpy,
        },
        {
          provide: CdkVirtualScrollViewport,
          useValue: {
            elementRef: {
              nativeElement: {
                scrollTop: 0,
                get clientHeight() {
                  return 200; // Return a fixed visible height
                },
                get scrollHeight() {
                  return 1000; // Return a fixed total scrollable height
                },
              },
            },
          },
        },
      ],
      imports: [
        HttpClientModule,
        MatCardModule,
        MatProgressSpinnerModule,
        ScrollingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    viewportMock = TestBed.inject(CdkVirtualScrollViewport);
    component.viewport = viewportMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a loading spinner when is loading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('.loading'));
    expect(loadingElement).toBeTruthy();
  });

  it('should not display loading spinner when isloading is false', () => {
    component.isLoading = false;
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('.loading'));
    expect(loadingElement).toBeFalsy();
  });

  it('should display a card of movies when loaded', () => {
    component.isLoading = false;
    component.movies = mockmovies;
    fixture.detectChanges();
    const movieCards = fixture.debugElement.query(By.css('.doctor-card'));
    expect(movieCards).toBeTruthy();
    expect(movieCards.parent?.children.length).toEqual(2);
  });

  it('should call loadMovies when scrolled to the bottom', () => {
    // Arrange
    spyOn(component, 'loadMovies');
    viewportMock.elementRef.nativeElement.scrollTop = 800; // Simulate scroll position

    // Act
    component.onScroll();

    // Assert
    expect(component.loadMovies).toHaveBeenCalled();
  });

  it('should not call loadMovies when already loading', () => {
    // Arrange
    spyOn(component, 'loadMovies');
    component.isLoading = true; // Simulate loading state
    viewportMock.elementRef.nativeElement.scrollTop = 800; // Simulate scroll position

    // Act
    component.onScroll();

    // Assert
    expect(component.loadMovies).not.toHaveBeenCalled();
  });

  it('should not call loadMovies when there are no more movies', () => {
    spyOn(component, 'loadMovies');
    component.hasMore = false;
    viewportMock.elementRef.nativeElement.scrollTop = 800;

    component.onScroll();

    expect(component.loadMovies).not.toHaveBeenCalled();
  });

  it('should load movies successfully when the number of movies is equal to the limit', () => {
    moviesServiceSpy.getMovies.and.returnValue(of(mockmovies));
    component.limit = 2; // Set limit to match the number of mock movies
    component.offset = 0; // Initial offset

    // Act
    component.loadMovies();
    fixture.detectChanges(); // Trigger change detection

    // Assert
    // expect(movieserviceSpy.getmovies).toHaveBeenCalledWith(component.limit, component.offset);
    expect(component.movies).toEqual(mockmovies);
    expect(component.offset).toBe(2); // Offset should be updated
    expect(component.hasMore).toBeTrue(); // There are more movies to load
    expect(component.isLoading).toBeFalse(); // Loading should be false after data is loaded
  });

  it('should handle error while loading movies', () => {
    const errorMessage = 'Error occurred while loading movies';
    moviesServiceSpy.getMovies.and.returnValue(
      throwError(() => new Error(errorMessage)),
    );
    component.limit = 2;
    component.offset = 0;

    component.loadMovies();

    expect(component.isLoading).toBeFalse(); // Loading should be false after error
  });

  it('should handle error when getting movies', () => {
    const mockCount = {count: 42} as Count;
    moviesServiceSpy.getMovies.and.returnValue(
      throwError(() => new Error('Error loading movies')),
    );
    moviesServiceSpy.getMoviesCount.and.returnValue(of(mockCount));
    component.limit = 2;
    component.offset = 0;

    component.loadInitialMovies();

    // Assert
    expect(component.isLoading).toBeFalse(); // Loading should be false after error
  });

  it('should load initial movies and count successfully', () => {
    const mockCount = {count: 42};
    moviesServiceSpy.getMovies.and.returnValue(of(mockmovies));
    moviesServiceSpy.getMoviesCount.and.returnValue(of(mockCount));
    component.limit = 2;
    component.offset = 0;

    component.loadInitialMovies();

    expect(moviesServiceSpy.getMovies).toHaveBeenCalled();
    expect(component.movies).toEqual(mockmovies);
    expect(component.count).toBe(mockCount.count);
    expect(component.offset).toBe(2);
    expect(component.isLoading).toBeFalse();
  });
});
