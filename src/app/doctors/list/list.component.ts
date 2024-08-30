import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Component, OnInit, ViewChild} from '@angular/core';
import {forkJoin, Subscription} from 'rxjs';

import {Doctor} from '../models/doctor.model';
import {DoctorService} from '../service/doctor.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class DoctorsListComponent implements OnInit {
  doctors: Doctor[] = [];
  visibleDoctors: Doctor[] = [];

  isLoading = false;

  limit = 24;
  offset = 0;

  hasMore = true;

  count = 0;

  subscription: Subscription[] = [];

  @ViewChild('viewport') viewport: CdkVirtualScrollViewport | undefined;

  constructor(private doctorFacadeService: DoctorService) {}

  ngOnInit(): void {
    this.loadInitialDoctors();
  }

  /**
   * The `loadDoctors` function fetches doctors from a service,
   * updates the list of doctors, and manages
   * loading state.
   */
  loadDoctors() {
    this.isLoading = true;
    const getDoctorSub = this.doctorFacadeService
      .getDoctors(this.limit, this.offset)
      .subscribe({
        next: (data: Doctor[]) => {
          if (data.length < this.limit) {
            this.hasMore = false;
          }
          this.doctors = [...this.doctors, ...data];
          this.offset += this.limit;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });

    this.subscription.push(getDoctorSub);
  }

  /**
   * The `loadInitialDoctors` function loads a set of doctors and their
   * count while managing loading state.
   */
  loadInitialDoctors() {
    this.isLoading = true;
    const forkedSub = forkJoin([
      this.doctorFacadeService.getDoctors(this.limit, this.offset),
      this.doctorFacadeService.getDoctorCount(),
    ]).subscribe({
      next: ([doctorSet, totalCount]) => {
        this.doctors = [...this.doctors, ...doctorSet];
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
   * The trackById function returns the id of a Doctor item based on its index.
   * @param {number} index - The `index` parameter in the `trackById` function represents the index of
   * the item in the collection that Angular is tracking. It is a number that indicates the position of
   * the item within the collection.
   * @param {Doctor} item - The `item` parameter in the `trackById` function represents an object of
   * type `Doctor`.
   * @returns The function `trackById` is returning the `id` property of the `Doctor` object at the
   * specified index in the array.
   */
  trackById(index: number, item: Doctor) {
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
      // adding a buffer of 200 pixels when user is about to go down to bottom
      if (
        offsetTop + clientHeight >= totalHeight - 200 &&
        !this.isLoading &&
        this.hasMore
      ) {
        this.loadDoctors();
      }
    }
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
