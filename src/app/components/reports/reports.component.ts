import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from '@angular/forms';
import {BackButtonDirective} from "../commons/back-button.directive";
import {ColumnConfig, MaktabClass, ReportRow, Student} from "../models/all.models";
import {HttpErrorResponse} from "@angular/common/http";
import {ClassService} from "../classes/class.service";
import {FeeService} from "../fees/fees.service";
import * as ExcelJS from 'exceljs';
import { PaginationComponent } from '../commons/pagination.component';
import {AttendanceService} from "../attendance/attendance.service";
import {ReportService} from "./report.service";
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonDirective, RouterLink, PaginationComponent]
})
export class ReportsComponent implements OnInit {
  private data: Object;
  constructor(private router: Router,
              private classService: ClassService,
              private feesService: FeeService,
              private reportService: ReportService) {
  }

  selectColumns: boolean;
  selectedReport = 'attendance';
  selectedClass = '';
  selectedMonth: string = 'January';
  classes: MaktabClass[] = [];
  reportTitle = '';
  tableColumns: string[] = [];
  reportData: ReportRow[] = [];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];
  selectedStatus: string = '';
  columns: ColumnConfig[] = [
    {key: 'id', header: 'ID', selected: false},
    {key: 'studentFullName', header: 'Student Name', selected: true},
    {key: 'className', header: 'Class Name', selected: true},
    {key: 'phone', header: 'Contact No.', selected: true},
    {key: 'month', header: 'Month', selected: true},
    {key: 'status', header: 'Status', selected: true},
    {key: 'paidAmount', header: 'Total Paid', selected: true},
    /*{key: 'dueAmount', header: 'Balance', selected: true},*/
    {key: 'remark', header: 'Remark', selected: true},
  ];

  ngOnInit(): void {
    this.loadClasses();
    //this.loadData(0);
  }
  currentPage = 0;
  totalPages = 10;
  totalItems: number;
  pageSize: number = 20;

  loadData(page: number) {
    let searchParams;
    if (this.selectedReport === 'attendance') {
      this.reportTitle = 'Attendance Report';
      this.tableColumns = ['Student', 'Present Days', 'Absent Days', 'Late days'];
      searchParams = {
        className: this.selectedClass,
        month: this.selectedMonth
      };
      this.getAttendance(searchParams);

    } else if (this.selectedReport === 'fees') {
      if (this.selectedMonth === '') {
        alert('Please select a month for the Fees Report.');
        return;
      }
      this.currentPage = page;
      this.reportTitle = 'Fees Report';
      this.tableColumns = this.columns
        //.filter(col => col.selected)
        .map(col => col.header);
      searchParams = {
        className: this.selectedClass,
        month: this.selectedMonth,
        status: this.selectedStatus,
        page: this.currentPage,
        size: this.pageSize
      };
      this.searchFees(searchParams);
    }
    // Add more report types as needed
  }

  loadClasses() {
    this.classService.getAll().subscribe(
      (data: MaktabClass[]) => {
        this.classes = data;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching students', error);
      }
    );
  }


  exportSelectedColumnsToExcel(): void {
    const selectedColumns = this.columns.filter(c => c.selected);

    if (selectedColumns.length === 0) {
      alert('Please select at least one column.');
      return;
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Add header row
    const headers = selectedColumns.map(col => col.header);
    worksheet.addRow(headers);

    // Add data rows
    this.reportData.forEach((row) => {
      const rowData = selectedColumns.map(col => {
        return (row as any)[col.key];
      });
      worksheet.addRow(rowData);
    });

    // Format header row (optional - make it bold)
    worksheet.getRow(1).font = { bold: true };

    // Adjust column widths
    selectedColumns.forEach((col, index) => {
      const column = worksheet.getColumn(index + 1);
      column.width = 15;
    });

    const fileName = this.reportTitle + `_` + this.selectedMonth + `_` + this.selectedStatus
      + `_` + new Date().toDateString() + `.xlsx`;

    // Write the workbook to a file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  downloadReport(): void {
    this.selectColumns = true;

  }

  /*prevPage() {
    if (this.currentPage > 1) this.currentPage--;
    const searchParams = {
      className: this.selectedClass,
      month: this.selectedMonth,
      status: this.selectedStatus,
      page: this.currentPage,
      size: this.pageSize
    };
    this.searchFees(searchParams);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
    const searchParams = {
      className: this.selectedClass,
      month: this.selectedMonth,
      status: this.selectedStatus,
      page: this.currentPage,
      size: this.pageSize
    };
    this.searchFees(searchParams);
  }*/

  private searchFees(searchParams: { className: string; month: string; status: string }) {
    this.feesService.searchFees(searchParams).subscribe(res => {
      this.reportData = res.data;
      this.currentPage = res.currentPage;
      this.totalItems = res.totalItems;
      this.pageSize = res.pageSize;
      this.totalPages = res.totalPages;
    });
  }

  private getAttendance(searchParams: any) {
    this.reportService.getAttendanceReport(searchParams).subscribe(res => {
      this.data = res;
    });
  }
}
