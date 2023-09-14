// global-filter.service.ts
import { Injectable } from '@angular/core';
import { Table } from 'primeng/table';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class GlobalFilterService {
  constructor(private datePipe: DatePipe) {}

  filterTableByDate(table: Table, searchTerm: string) {
    // Regular expression to match the "dd-mmm-yyyy" format
    const dateFormatRegex = /^\d{2}-[A-Za-z]{3}-\d{4}$/;

    if (dateFormatRegex.test(searchTerm)) {
      const date = this.datePipe.transform(searchTerm, "yyyy-MM-dd");
      table.filterGlobal(date, 'contains');
    } else {
      table.filterGlobal(searchTerm, 'contains');
    }
  }
}
