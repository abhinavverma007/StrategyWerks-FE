import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MoviesListComponent} from './list/list.component';
import {MoviesRoutingModule} from './movies-routing.module';
import {MoviesService} from './service/movies.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {HttpClientModule} from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  declarations: [MoviesListComponent],
  imports: [
    CommonModule,
    MoviesRoutingModule,
    FlexLayoutModule,
    MatCardModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    ScrollingModule,
  ],
  providers: [MoviesService],
})
export class MoviesModule {}
