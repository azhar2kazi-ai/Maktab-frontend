import { Component, OnInit } from '@angular/core';
import { EvaluationService } from './evaluation.service';
import { Evaluation } from '../models/all.models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluation-list.component.html',
  styleUrls: ['./evaluation-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class EvaluationListComponent implements OnInit {
  evaluations: Evaluation[] = [];
  loading = false;

  constructor(private evaluationService: EvaluationService, private router: Router) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.evaluationService.list({ page: 0, size: 20 }).subscribe({
      next: (res) => {
        this.evaluations = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load evaluations', err);
        this.loading = false;
      }
    });
  }

  deleteEvaluation(id?: number) {
    if (!id) return;
    if (!confirm('Delete this evaluation?')) return;
    this.evaluationService.delete(id).subscribe({
      next: () => this.evaluations = this.evaluations.filter(e => e.id !== id),
      error: err => console.error('Failed to delete', err)
    });
  }

  onNew() {
    this.router.navigate(['/evaluations', 'new']);
  }

  onEdit(id?: number) {
    if (!id) return;
    this.router.navigate(['/evaluations', 'edit', id]);
  }

  onAssign() {
    this.router.navigate(['/evaluations', 'assign']);
  }

}

