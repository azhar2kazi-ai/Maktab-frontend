import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { SubjectService } from './subjects.service'; // point to service, not model
import { Subject } from '../models/all.models';
import {CommonModule} from "@angular/common";
@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SubjectComponent implements OnInit {

  subjects: Subject[] = [];
  constructor(private subjectService: SubjectService) { }

 ngOnInit(): void {
     this.loadSubjects();
   }

   loadSubjects(): void {
     this.subjectService.getAll().subscribe((data: Subject[]) => {
       this.subjects = data;
     }, (error: any) => {
       console.error('Error fetching subjects', error);
     });
   }

  deleteSubject(id: number): void {
     if (confirm('Are you sure you want to delete this subject?')) {
       this.subjectService.delete(id).subscribe(() => {
         // remove deleted subject from local array
         this.subjects = this.subjects.filter(s => s.id !== id);
       }, (error: any) => {
         console.error('Error deleting subject', error);
       });
     }
   }
}
