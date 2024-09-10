import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Flight } from '../../types/flights';
import { Airport } from 'src/types/airport';
import { FilterFlifght } from 'src/types/filter';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private router: Router) {}
  private API_URL = 'http://localhost:3000/api';

  private _flights = new BehaviorSubject<Flight[]>([]);

  flights = this._flights.asObservable();

  getAllFlights(filter?: FilterFlifght): Observable<Flight[]> {
    console.log('getAllFlights CALLED');
    let params = new HttpParams();

    if (filter?.flightNumber) {
      params = params.append('flightNumber', filter.flightNumber);
    }
    if (filter?.takeoffAirport) {
      params = params.append('takeoffAirportId', filter.takeoffAirport);
    }
    if (filter?.landingAirport) {
      params = params.append('landingAirportId', filter.landingAirport);
    }
    if (filter?.id) {
      params = params.append('id', filter.id);
    }

    return this.http.get<Flight[]>(`${this.API_URL}/flights`, { params }).pipe(
      tap((newFlights) => {
        console.log('new fLIGHT TO uPDATE! ', newFlights);
        this._flights.next(newFlights);
      })
    );
  }

  createFlight(flight: Flight) {
    console.log('flight get to create and send !', flight.flightNumber);

    return this.http.post(`${this.API_URL}/flights`, {
      flightNumber: flight.flightNumber,
      landingTime: flight.landingTime,
      status: flight.status,
      takeoffTime: flight.takeoffTime,
      landingAirportId: flight.landingAirport,
      takeoffAirportId: flight.takeoffAirport,
    });
  }

  upadteFlight(flight: Flight) {
    console.log('upadteFlight flightId', flight.id, flight);

    return this.http
      .patch(`${this.API_URL}/flights/${flight.id}`, {
        flight: {
          flightNumber: flight.flightNumber,
          landingTime: flight.landingTime,
          status: flight.status,
          takeoffTime: flight.takeoffTime,
          landingAirportId: flight.landingAirport,
          takeoffAirportId: flight.takeoffAirport,
        },
      })
      .pipe(
        tap((res) => {
          if (res) console.log('upadte Flight!', res);
          else console.log('Cant upadte Flight ! ');
        })
      );
  }
  deleteFlight(flightId: string) {
    return this.http.delete(`${this.API_URL}/flights/${flightId}`).pipe(
      tap((res) => {
        if (res) {
          const currentFlights = this._flights.getValue();
          const updatedFlights = currentFlights.filter(
            (flight) => flight.id !== flightId
          );
          this._flights.next(updatedFlights);
          console.log('delete Flight! ', res);
        } else console.log('Cant delete Flight ! ');
      })
    );
  }
  getAllAirports() {
    return this.http.get<Airport[]>(`${this.API_URL}/airports`);
  }
}
