import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { MatSelectChange } from '@angular/material/select';
import { Flight } from '../../types/flights';
import { TableColumns } from '../../types/table';
import { TableBasicExample } from '../table/table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FlightFilterComponent } from '../flight-filter/flight-filter.component';
import { FilterFlifght } from 'src/types/filter';
import { Observable, map } from 'rxjs';
import { WebSocketService } from '../services/web-socket.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    TableBasicExample,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    FlightFilterComponent,
  ],
})
export class HomeComponent implements OnInit {
  requestSent = false;
  flights: Flight[] = [];
  tableColumns: TableColumns[] = [
    { key: 'flightNumber', title: 'Flight Num.' },
    { key: 'landingAirport', title: 'Landing' },
    { key: 'takeoffAirport', title: 'Takeoff' },
    { key: 'landingTime', title: 'Landing' },
    { key: 'takeoffTime', title: 'Takeoff' },
    { key: 'status', title: 'Status' },
    { action: 'edit', title: 'Edit' },
    { action: 'delete', title: 'Delete' },
  ];
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  isDialogOpen: boolean = false;
  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private router: Router,
    private webSocketService: WebSocketService
  ) {}
  flightFilterData: FilterFlifght = {
    flightNumber: '',
    landingAirport: '',
    takeoffAirport: '',
  };

  handleFilterChange(filterData: FilterFlifght) {
    this.flightFilterData = filterData;
    console.log('Filtered Data:', this.flightFilterData);
    this.apiService.getAllFlights(filterData).subscribe((flights) => {
      this.flights = flights;
      console.log('flights', flights);
    });
  }

  ngOnInit(): void {
    this.webSocketService.listen('pong').subscribe((data: any) => {
      console.log('Received:', data);
      this.getAllFlightFromDb();
    });
    this.getAllFlightFromDb();

    this.apiService.flights.subscribe((flights) => {
      this.flights = flights;
      console.log('this.flightFilterData', this.flightFilterData);
      console.log('new flights at home!! ', flights);
    });
  }

  getAllFlightFromDb() {
    this.apiService
      .getAllFlights(this.flightFilterData)
      .subscribe((flights) => {
        this.flights = flights;
      });
  }
  sendPing() {
    this.webSocketService.sendMessage('ping', {
      message: 'Flights is Updated! ',
    });
  }
  deleteFlight(id: { flightId: string }) {
    if (confirm('Do you want to remove the flight?')) {
      this.apiService.deleteFlight(id.flightId).subscribe((res) => {
        console.log('res', res);
        if (res) {
          this.requestSent = true;
          setTimeout(() => {
            this.requestSent = false;
          }, 2000);
        }
      });
    }
  }
  editFlight(flight: Flight) {
    this.router.navigateByUrl(`/create/${flight.id}`);
  }
  onOpenDialog() {
    this.router.navigateByUrl('/create');
  }
}
