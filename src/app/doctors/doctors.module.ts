import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DoctorsListComponent} from './list/list.component';
import {DoctorsRoutingModule} from './doctors-routing.module';
import {DoctorService} from './service/doctor.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {HttpClientModule} from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  declarations: [DoctorsListComponent],
  imports: [
    CommonModule,
    DoctorsRoutingModule,
    FlexLayoutModule,
    MatCardModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    ScrollingModule,
  ],
  providers: [DoctorService],
})
export class DoctorsModule {}
