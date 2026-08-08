import {Component, OnDestroy, OnInit} from '@angular/core';
import {StudentService} from './students.service'; // correct path
import {PaginatorService} from '../../shared/services/paginator.service';
import {PageResponse} from '../../shared/models/page-response.model';
import {Student} from '../models/all.models'; // correct path
import {RouterLink} from '@angular/router';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BackButtonDirective} from "../commons/back-button.directive";
import {BehaviorSubject, Subject, switchMap, takeUntil} from 'rxjs';
import {PaginationComponent} from "../../shared/components/pagination/pagination_pagination.component";
import {API_BASE} from "../_api-base";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BackButtonDirective, PaginationComponent, PaginationComponent]
})
export class StudentListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private pageReq$ = new BehaviorSubject<{ page: number; size: number }>(
    {page: 0, size: 20});

  pageData?: PageResponse<Student> | null = null;
  loading = false;
  students: Student[] = [];

  constructor(private paginator: PaginatorService, private studentService: StudentService) {
    this.pageReq$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(req => {
          this.loading = true;
          // optionally pass sort: ['name,asc']
          return this.paginator.fetchPage<Student>(`${API_BASE}`+`/student/`, {page: req.page, size: req.size});
        })
      )
      .subscribe({
        next: res => {
          this.pageData = res;
          this.loading = false;
        },
        error: err => {
          console.error('Failed to load page', err);
          this.loading = false;
        },
      });
  }


  ngOnInit(): void {
    //this.loadData(0);
  }

  searchText: string = '';

  filteredStudents() {
    if (!this.searchText) {
      return this.pageData.content;
    }

    const lower = this.searchText.toLowerCase();

    return this.students.filter(student =>
      student.name?.toLowerCase().includes(lower) ||
      student.guardianName?.toLowerCase().includes(lower) ||
      student.surName?.toLowerCase().includes(lower) ||
      student.maktabClass?.name?.toLowerCase().includes(lower) ||
      student.phone?.toLowerCase().includes(lower)
    );
  }

  loadData(page: number): void {
    this.studentService.getAll({"page": page, "size": 0}).subscribe({
      next: (data: Student[]) => {
        this.students = data;
        // Optional success message
      },
      error: (error: any) => {
        console.error('Error fetching students', error);
      }
    });
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.delete(id).subscribe(() => {
        this.students = this.students.filter(s => s.id !== id);
      }, (error: any) => {
        console.error('Error deleting student', error);

      });
    }
  }

  onPageChange(evt: { page: number; size: number }) {
    // when size changes, backend typically expects page=0
    this.pageReq$.next({page: evt.page, size: evt.size});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

