import {TestBed} from '@angular/core/testing';

import {DoctorService} from './doctor.service';
import {HttpClientModule} from '@angular/common/http';
import {Count} from '../models/count.model';
import {Doctor} from '../models/doctor.model';

describe('DoctorService', () => {
  let service: DoctorService;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DoctorService],
      imports: [HttpClientModule],
    });
    service = TestBed.inject(DoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
