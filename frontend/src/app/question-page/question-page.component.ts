import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface QuestionResponse {
  answer: string;
  keywords?: string[];
}

@Component({
  selector: 'app-question-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <button (click)="goBack()" style="background: #666; margin-bottom: 1rem;">
        ← Back to School Selection
      </button>
      <h1>{{ school }} - Ask a Question</h1>
      <p style="color: #666; margin-bottom: 2rem;">
        Ask any question about school procedures, policies, or information
      </p>
      
      <form (ngSubmit)="submitQuestion()" #questionForm="ngForm">
        <textarea
          [(ngModel)]="question"
          name="question"
          placeholder="Enter your question here..."
          required
          [disabled]="loading"
        ></textarea>
        
        <button 
          type="submit" 
          [disabled]="loading || !question.trim()"
          style="width: 100%;"
        >
          {{ loading ? 'Processing...' : 'Ask Question' }}
        </button>
      </form>

      <div *ngIf="error" class="error">
        {{ error }}
      </div>

      <div *ngIf="loading" class="loading">
        <p>Processing your question...</p>
        <p style="font-size: 0.9rem; color: #999;">Extracting keywords and finding relevant information...</p>
      </div>

      <div *ngIf="response" class="response">
        <h3>Answer:</h3>
        <p>{{ response }}</p>
      </div>
    </div>
  `
})
export class QuestionPageComponent implements OnInit {
  school: string = '';
  question: string = '';
  response: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.school = this.route.snapshot.paramMap.get('school') || '';
    if (!this.school) {
      this.router.navigate(['/']);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  submitQuestion() {
    if (!this.question.trim()) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.response = '';

    const payload = {
      school: this.school,
      question: this.question
    };

    this.http.post<QuestionResponse>('http://localhost:8000/api/question', payload)
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.response = data.answer;
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.detail || err.message || 'An error occurred while processing your question';
          console.error('Error:', err);
        }
      });
  }
}