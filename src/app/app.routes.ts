import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'game',
    loadChildren: () => import('./board/board-routing.module').then((m) => m.BoardRoutingModule),
  },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];
