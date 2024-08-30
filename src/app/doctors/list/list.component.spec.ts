import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {By} from '@angular/platform-browser';

import {Doctor} from '../models/doctor.model';
import {DoctorService} from '../service/doctor.service';
import {DoctorsListComponent} from './list.component';
import {of, throwError} from 'rxjs';
import {Count} from '../models/count.model';

describe('ListComponent', () => {
  let component: DoctorsListComponent;
  let fixture: ComponentFixture<DoctorsListComponent>;
  let doctorServiceSpy: jasmine.SpyObj<DoctorService>;

  let viewportMock: CdkVirtualScrollViewport;

  const mockDoctors = [
    {
      consultationFee: 500,
      location: 'Dee',
      name: 'fff',
      phoneNumber: '4334343',
      rating: 4,
      specialization: 'cardio',
      id: '937070a3-25e2-4878-b1da-cc138b5288f1',
    },
    {
      consultationFee: 600,
      location: 'gis',
      name: 'ppwq',
      phoneNumber: '23323',
      rating: 5,
      specialization: 'neuro',
      id: '4bfbf692-65c8-42fc-8e34-175eee703532',
    },
  ] as Doctor[];

  beforeEach(async () => {
    doctorServiceSpy = jasmine.createSpyObj('DoctorService', [
      'getDoctorCount',
      'getDoctors',
    ]);
    await TestBed.configureTestingModule({
      declarations: [DoctorsListComponent],
      providers: [
        {
          provide: DoctorService,
          useValue: doctorServiceSpy,
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

    fixture = TestBed.createComponent(DoctorsListComponent);
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

  it('should display a card of doctors when loaded', () => {
    component.isLoading = false;
    component.doctors = mockDoctors;
    fixture.detectChanges();
    const doctorCards = fixture.debugElement.query(By.css('.doctor-card'));
    expect(doctorCards).toBeTruthy();
    expect(doctorCards.parent?.children.length).toEqual(2);
  });

  it('should call loadDoctors when scrolled to the bottom', () => {
    // Arrange
    spyOn(component, 'loadDoctors');
    viewportMock.elementRef.nativeElement.scrollTop = 800; // Simulate scroll position

    // Act
    component.onScroll();

    // Assert
    expect(component.loadDoctors).toHaveBeenCalled();
  });

  it('should not call loadDoctors when already loading', () => {
    // Arrange
    spyOn(component, 'loadDoctors');
    component.isLoading = true; // Simulate loading state
    viewportMock.elementRef.nativeElement.scrollTop = 800; // Simulate scroll position

    // Act
    component.onScroll();

    // Assert
    expect(component.loadDoctors).not.toHaveBeenCalled();
  });

  it('should not call loadDoctors when there are no more doctors', () => {
    spyOn(component, 'loadDoctors');
    component.hasMore = false;
    viewportMock.elementRef.nativeElement.scrollTop = 800;

    component.onScroll();

    expect(component.loadDoctors).not.toHaveBeenCalled();
  });

  it('should load doctors successfully when the number of doctors is equal to the limit', () => {
    doctorServiceSpy.getDoctors.and.returnValue(of(mockDoctors));
    component.limit = 2; // Set limit to match the number of mock doctors
    component.offset = 0; // Initial offset

    // Act
    component.loadDoctors();
    fixture.detectChanges(); // Trigger change detection

    // Assert
    // expect(doctorServiceSpy.getDoctors).toHaveBeenCalledWith(component.limit, component.offset);
    expect(component.doctors).toEqual(mockDoctors);
    expect(component.offset).toBe(2); // Offset should be updated
    expect(component.hasMore).toBeTrue(); // There are more doctors to load
    expect(component.isLoading).toBeFalse(); // Loading should be false after data is loaded
  });

  it('should handle error while loading doctors', () => {
    const errorMessage = 'Error occurred while loading doctors';
    doctorServiceSpy.getDoctors.and.returnValue(
      throwError(() => new Error(errorMessage)),
    );
    component.limit = 2;
    component.offset = 0;

    component.loadDoctors();

    expect(component.isLoading).toBeFalse(); // Loading should be false after error
  });

  it('should handle error when getting doctors', () => {
    const mockCount = {count: 42} as Count;
    doctorServiceSpy.getDoctors.and.returnValue(
      throwError(() => new Error('Error loading doctors')),
    );
    doctorServiceSpy.getDoctorCount.and.returnValue(of(mockCount));
    component.limit = 2;
    component.offset = 0;

    component.loadInitialDoctors();

    // Assert
    expect(component.isLoading).toBeFalse(); // Loading should be false after error
  });

  it('should load initial doctors and count successfully', () => {
    const mockCount = {count: 42};
    doctorServiceSpy.getDoctors.and.returnValue(of(mockDoctors));
    doctorServiceSpy.getDoctorCount.and.returnValue(of(mockCount));
    component.limit = 2;
    component.offset = 0;

    component.loadInitialDoctors();

    expect(doctorServiceSpy.getDoctorCount).toHaveBeenCalled();
    expect(component.doctors).toEqual(mockDoctors);
    expect(component.count).toBe(mockCount.count);
    expect(component.offset).toBe(2);
    expect(component.isLoading).toBeFalse();
  });
});
