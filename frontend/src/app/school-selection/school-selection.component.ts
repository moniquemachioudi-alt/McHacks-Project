import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-school-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h1>Select Your School</h1>
      <p style="text-align: center; margin-bottom: 2rem; color: #666;">
        Choose your school to get started with questions about procedures and policies
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
        <button 
          *ngFor="let school of schools" 
          (click)="selectSchool(school)"
          class="school-button"
        >
          {{ school }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .school-button {
      padding: 2rem;
      font-size: 1.2rem;
      font-weight: 600;
      min-height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class SchoolSelectionComponent {
  schools = ['McGill', 'Concordia', 'UoFT', 'UBC', 'McMaster'];

  constructor(private router: Router) {}

  selectSchool(school: string) {
    this.router.navigate(['/question', school]);
  }
}