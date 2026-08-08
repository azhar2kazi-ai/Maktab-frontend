import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EvaluationService } from './evaluation.service';
import { Evaluation, EvaluationDTO } from '../models/all.models';

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EvaluationFormComponent implements OnInit {
  evaluation: Evaluation = {
    name: '',
    description: '',
    //maxScore: 100,
    //passingScore: 0,
    active: true,
    //remarks: ''
  };

  submitting = false;
  isEdit = false;

  constructor(
    private evaluationService: EvaluationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.isEdit = true;
        this.evaluationService.get(id).subscribe({
          next: (res) => {
            this.evaluation = res;
          },
          error: (err) => {
            console.error('Failed to load evaluation', err);
          }
        });
      }
    }
  }

  submitForm(): void {
    if (!this.evaluation.name || this.evaluation.name.trim().length === 0) {
      alert('Please enter a name for the evaluation');
      return;
    }

    this.submitting = true;

    if (this.isEdit && this.evaluation.id) {
      this.evaluationService.update(this.evaluation.id, this.evaluation).subscribe({
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
    } else {
      const dto: EvaluationDTO = {
        name: this.evaluation.name,
        description: this.evaluation.description,
        //maxScore: this.evaluation.maxScore,
        //passingScore: this.evaluation.passingScore,
        active: this.evaluation.active,
        //remarks: this.evaluation.remarks
      };
      this.evaluationService.create(dto).subscribe({
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
    this.router.navigate(['/evaluations']);
  }
}

