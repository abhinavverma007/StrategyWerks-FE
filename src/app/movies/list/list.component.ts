import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Component, OnInit, ViewChild} from '@angular/core';
import {forkJoin, Subscription} from 'rxjs';

import {Movies} from '../models/movies.model';
import {MoviesService} from '../service/movies.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class MoviesListComponent implements OnInit {
  movies: Movies[] = [];

  isLoading = false;

  limit = 10;
  offset = 0;

  hasMore = true;

  count = 0;

  subscription: Subscription[] = [];

  @ViewChild('viewport') viewport: CdkVirtualScrollViewport | undefined;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.loadInitialMovies();
  }

  /**
   * The `loadMoives` function fetches movies from a service,
   * updates the list of movies, and manages
   * loading state.
   */
  loadMovies() {
    this.isLoading = true;
    const getMovieSub = this.moviesService
      .getMovies(this.limit, this.offset)
      .subscribe({
        next: (data: Movies[]) => {
          if (data.length < this.limit) {
            this.hasMore = false;
          }
          this.movies = [...this.movies, ...data];
          this.offset += this.limit;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });

    this.subscription.push(getMovieSub);
  }

  /**
   * The `loadInitialMovies` function loads a set of movies and their
   * count while managing loading state.
   */
  loadInitialMovies() {
    this.isLoading = true;
    const forkedSub = forkJoin([
      this.moviesService.getMovies(this.limit, this.offset),
      this.moviesService.getMoviesCount(),
    ]).subscribe({
      next: ([movieSet, totalCount]) => {
        this.movies = [...this.movies, ...movieSet];
        this.count = totalCount.count;
        this.offset += this.limit;

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });

    this.subscription.push(forkedSub);
  }

  /**
   * The trackById function returns the id of a Movie item based on its index.
   * @param {number} index - The `index` parameter in the `trackById` function represents the index of
   * the item in the collection that Angular is tracking. It is a number that indicates the position of
   * the item within the collection.
   * @param {Movie} item - The `item` parameter in the `trackById` function represents an object of
   * type `Movie`.
   * @returns The function `trackById` is returning the `id` property of the `Movie` object at the
   * specified index in the array.
   */
  trackById(index: number, item: Movies) {
    return item.id;
  }

  /**
   * The function `onScroll` checks if the user has scrolled to the bottom of a viewport and triggers
   * loading more data if certain conditions are met.
   */
  onScroll() {
    if (this.viewport) {
      const offsetTop = this.viewport.elementRef.nativeElement.scrollTop;
      const totalHeight = this.viewport.elementRef.nativeElement.scrollHeight;
      const clientHeight = this.viewport.elementRef.nativeElement.clientHeight;
      // adding a buffer of 300 pixels when user is about to go down to bottom
      if (
        offsetTop + clientHeight >= totalHeight - 300 &&
        !this.isLoading &&
        this.hasMore
      ) {
        this.loadMovies();
      }
    }
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
