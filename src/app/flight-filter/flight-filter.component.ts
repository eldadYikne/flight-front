import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Airport } from 'src/types/airport';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { FlightInput } from 'src/types/createFlight';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flight-filter',
  templateUrl: './flight-filter.component.html',
  styleUrls: ['./flight-filter.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    CommonModule,
  ],
})
export class FlightFilterComponent {
  @Output() filterChange = new EventEmitter<{
    flightNumber: string;
    takeoffAirport: string;
    landingAirport: string;
  }>();
  flightNumber: string = '';
  takeoffAirport: string = '';
  landingAirport: string = '';

  constructor(private apiService: ApiService) {}
  airports$: Observable<Airport[]> | undefined;
  requestSent: boolean = false;
  ngOnInit(): void {
    this.airports$ = this.apiService.getAllAirports().pipe(
      map((airports: Airport[]) => {
        return airports;
      })
    );
  }

  onSubmit() {
    const filterData = {
      flightNumber: this.flightNumber,
      takeoffAirport: this.takeoffAirport,
      landingAirport: this.landingAirport,
    };
    console.log('filter', filterData);
    this.filterChange.emit(filterData);
  }
}
