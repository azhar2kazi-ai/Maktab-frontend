import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageResponse } from '../../models/page-response.model';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input({ required: true }) page!: PageResponse<any>;
  @Input() pageSizeOptions: number[] = [10, 20, 50, 100];
  @Input() maxPageButtons = 7;

  @Output() pageChange = new EventEmitter<{ page: number; size: number }>();

  goTo(pageIndex: number) {
    const target = Math.max(0, Math.min(pageIndex, Math.max(0, this.page.totalPages - 1)));
    if (target !== this.page.page) {
      this.pageChange.emit({ page: target, size: this.page.size });
    }
  }

  changeSize(size: number) {
    // go to first page when size changes
    this.pageChange.emit({ page: 0, size });
  }

  private pageWindow(): number[] {
    if (!this.page || this.page.totalPages <= 1) return [0];
    const half = Math.floor(this.maxPageButtons / 2);
    let start = Math.max(0, this.page.page - half);
    let end = Math.min(this.page.totalPages - 1, start + this.maxPageButtons - 1);
    if (end - start + 1 < this.maxPageButtons) {
      start = Math.max(0, end - this.maxPageButtons + 1);
    }
    const nums: number[] = [];
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }

  // template helper
  get pageNumbers(): number[] {
    return this.pageWindow();
  }
}