import { EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TableColumns } from '../../types/table';
import { Flight } from '../../types/flights';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatIconModule,
  ],
})
export class TableBasicExample {
  @Input() dataColumn: TableColumns[] = [];
  @Input() data: Flight[] = [];
  @Output() deleteFlightId = new EventEmitter<{
    flightId: string;
  }>();
  @Output() EditFlight = new EventEmitter<Flight>();
  flightId: string = '';
  displayedColumns: string[] = [];
  dataSource: Flight[] = [];

  ngOnInit() {
    this.displayedColumns = this.dataColumn.map(
      (column) => column.key ?? column.action ?? ''
    );
    this.dataSource = this.data;
    // console.log('this.data', this.data);
    // console.log('this.displayedColumns', this.displayedColumns);
  }

  EditRow(element: Flight) {
    // console.log('element', element.id);
    if (element.id) {
      this.EditFlight.emit(element);
    }
  }
  deleteRow(element: Flight) {
    // console.log('element', element.id);
    if (element.id) {
      const newId = { flightId: element.id };
      this.deleteFlightId.emit(newId);
    }
  }
  formatTime(time: string): string {
    // Split the string by the colon
    const [hours, minutes] = time.split(':');

    // Pad the hours with a leading zero if necessary
    const formattedHours = hours.length === 1 ? '0' + hours : hours;

    // Return the formatted time with the padded hours
    return `${formattedHours}:${minutes}`;
  }
}
