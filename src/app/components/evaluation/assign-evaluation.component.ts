import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EvaluationService } from './evaluation.service';
import { ClassService } from '../classes/class.service';
import { Evaluation, MaktabClass } from '../models/all.models';

@Component({
  selector: 'app-assign-evaluation',
  templateUrl: './assign-evaluation.component.html',
  styleUrls: ['./assign-evaluation.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AssignEvaluationComponent implements OnInit {
  classes: MaktabClass[] = [];
  evaluations: Evaluation[] = [];
  selectedClassId: number | null = null;
  selectedEvaluationIds: Set<number> = new Set();
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private evaluationService: EvaluationService,
    private classService: ClassService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadEvaluations();
  }

  loadClasses(): void {
    this.classService.getAll().subscribe({
      next: (res) => {
        this.classes = res || [];
      },
      error: (err) => {
        console.error('Failed to load classes', err);
        this.showMessage('Failed to load classes', 'error');
      }
    });
  }

  loadEvaluations(): void {
    this.evaluationService.list({ page: 0, size: 20 }).subscribe({
      next: (res) => {
        this.evaluations = res || [];
      },
      error: (err) => {
        console.error('Failed to load evaluations', err);
        this.showMessage('Failed to load evaluations', 'error');
      }
    });
  }

  onClassSelected(): void {
    if (!this.selectedClassId || this.selectedClassId <= 0) {
      this.selectedEvaluationIds.clear();
      return;
    }
    // Load already-linked evaluations and pre-select them
    this.evaluationService.getLinkedEvaluationsForClass(this.selectedClassId).subscribe({
      next: (linked) => {
        this.selectedEvaluationIds.clear();
        if (linked && linked.length > 0) {
          linked.forEach((item: any) => {
            if (item.evaluationId) {
              this.selectedEvaluationIds.add(item.evaluationId);
            }
          });
        }
      },
      error: (err) => {
        console.error('Failed to load linked evaluations', err);
        this.selectedEvaluationIds.clear();
      }
    });
  }

  toggleEvaluation(evalId: number): void {
    if (this.selectedEvaluationIds.has(evalId)) {
      this.selectedEvaluationIds.delete(evalId);
    } else {
      this.selectedEvaluationIds.add(evalId);
    }
  }

  isEvaluationSelected(evalId?: number): boolean {
    return evalId ? this.selectedEvaluationIds.has(evalId) : false;
  }

  submitForm(): void {
    if (!this.selectedClassId || this.selectedClassId <= 0) {
      this.showMessage('Please select a class', 'error');
      return;
    }

    if (this.selectedEvaluationIds.size === 0) {
      this.showMessage('Please select at least one evaluation', 'error');
      return;
    }

    this.submitting = true;
    const evalIds = Array.from(this.selectedEvaluationIds);
    this.evaluationService.linkEvaluationsToClass(this.selectedClassId, evalIds).subscribe({
      next: () => {
        this.submitting = false;
        this.showMessage('Evaluations assigned to class successfully!', 'success');
      },
      error: (err) => {
        this.submitting = false;
        console.error('Failed to assign evaluations', err);
        this.showMessage('Failed to assign evaluations to class', 'error');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/evaluations']);
  }

   private showMessage(msg: string, type: 'success' | 'error'): void {
     this.message = msg;
     this.messageType = type;
     setTimeout(() => {
       this.message = '';
     }, 5000);
   }
}

