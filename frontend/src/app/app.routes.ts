import { Routes } from '@angular/router';
import { SchoolSelectionComponent } from './school-selection/school-selection.component';
import { QuestionPageComponent } from './question-page/question-page.component';

export const routes: Routes = [
  { path: '', component: SchoolSelectionComponent },
  { path: 'question/:school', component: QuestionPageComponent },
  { path: '**', redirectTo: '' }
];