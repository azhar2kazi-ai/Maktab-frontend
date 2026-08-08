import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EvaluationService } from './evaluation.service';
import { StudentEvaluation} from '../models/all.models';

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './student-evaluation-form.component.html',
  styleUrls: ['./student-evaluation-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class StudentEvaluationFormComponent implements OnInit {
  protected isEditable: boolean;
  protected studentEvaluation: StudentEvaluation;
  protected submitting: boolean;
  private studentId: string;

  constructor(
    private evaluationService: EvaluationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');
    if (this.studentId) {
      const id = Number(this.studentId);
      if (!isNaN(id)) {
        this.isEditable = true;
        this.evaluationService.getEvaluationForm(id).subscribe({
          next: (res) => {
            this.studentEvaluation = res;
          },
          error: (err) => {
            console.error('Failed to load evaluation', err);
          }
        });
      }
    }
  }

  submitEvaluationForm(): void {
    this.submitting = true;

    /*if (this.isEdit && this.studentEvaluation.id) {
      this.evaluationService.updateE(this.studentEvaluation.id, this.studentEvaluation).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/evaluations']);
        },
        error: (err) => {
          this.submitting = false;
          console.error('Update failed', err);
          alert('Failed to update evaluation');
        }
      });
    } else */{
      // @ts-ignore
      const dto: StudentEvaluation = {
        student: this.studentEvaluation.student,
        evaluation: this.studentEvaluation.evaluation,
        remarks: this.studentEvaluation.remarks,
        evaluatorName: this.studentEvaluation.evaluatorName,
        evaluationDate: this.studentEvaluation.evaluationDate,
        maktabClass: this.studentEvaluation.maktabClass
      };
      this.evaluationService.submitEvaluationForm(dto).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/evaluations']);
        },
        error: (err) => {
          this.submitting = false;
          console.error('Create failed', err);
          alert('Failed to create evaluation');
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/student/details/' + this.studentEvaluation.student.id]);
  }
}

