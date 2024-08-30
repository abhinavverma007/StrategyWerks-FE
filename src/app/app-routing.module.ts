import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'doctors',
    loadChildren: () =>
      import('./doctors/doctors.module').then(m => m.DoctorsModule),
  },
  {path: '', redirectTo: '/doctors', pathMatch: 'full'},
  {path: '**', redirectTo: '/doctors'}, // Wildcard route for a 404 page or default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
