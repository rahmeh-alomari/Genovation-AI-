import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-smart-table-component',
  standalone: true,
  imports: [CommonModule, TooltipModule, TableModule, ButtonModule, InputTextModule, FileUploadModule, ToolbarModule, ],
  templateUrl: './smart-table-component.html',
  styleUrls: ['./smart-table-component.css'],
  providers: [MessageService]
})

export class SmartTableComponent {
  @Input() columns: { field: string; header: string }[] = [];
  @Input() data: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();


  onEdit(row: any) {
    this.edit.emit(row);
  }


  onDelete(row: any) {
    this.delete.emit(row);
  }
  @ViewChild('dt') table!: Table;



  get globalFilterFields(): string[] {
    return this.columns.map(col => col.field);
  }
  onExportCSV(): void {
    const csv = this.convertToCSV(this.data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'table-export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  convertToCSV<T extends Record<string, any>>(objArray: T[]): string {
    if (!objArray.length) return '';

    const headers = Object.keys(objArray[0]);
    const csvRows = objArray.map((obj: T) =>
      headers.map(header => JSON.stringify(obj[header] ?? '')).join(',')
    );

    return [headers.join(','), ...csvRows].join('\r\n');
  }

}
