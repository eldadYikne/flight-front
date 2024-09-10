import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FlightInput } from 'src/types/createFlight';
import { Flight, FlightStatus } from 'src/types/flights';
import { ApiService } from '../services/api.service';
import { Airport } from 'src/types/airport';
import { ActivatedRoute, Router } from '@angular/router';
import { formatTime } from 'src/utils';

@Component({
  selector: 'app-create-flight',
  templateUrl: './create-flight.component.html',
  styleUrls: ['./create-flight.component.scss'],
})
export class CreateFlightComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  airports: Airport[] = [];
  errorsInputs: Array<keyof Flight> = [];
  requestSent: boolean = false;
  id: string = '';
  newFlightForm = new FormGroup({
    flightNumber: new FormControl('', Validators.required),
    status: new FormControl(FlightStatus.HANGER, Validators.required),
    takeoffAirport: new FormControl('', Validators.required),
    landingAirport: new FormControl('', Validators.required),
    takeoffTime: new FormControl('', Validators.required),
    landingTime: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
    this.apiService.getAllAirports().subscribe((airports) => {
      this.airports = airports;
      // console.log(airports);
      this.inputs = this.inputs.map((input) => {
        if (input.key === 'takeoffAirport' || input.key === 'landingAirport') {
          return { ...input, data: airports };
        }
        return input;
      });
    });

    this.id = this.route.snapshot.paramMap.get('id') ?? ''; // Capture the ID from the URL
    // console.log('Received ID:', this.id);
    if (this.id) {
      this.apiService
        .getAllFlights({
          id: this.id,
          flightNumber: '',
          landingAirport: '',
          takeoffAirport: '',
        })
        .subscribe((flights) => {
          // console.log('flights', flights);
          const existingFlight = flights.find(
            (flight) => String(flight.id) === String(this.id)
          );
          if (existingFlight) {
            this.newFlightForm.patchValue({
              flightNumber: existingFlight.flightNumber,
              status: existingFlight.status,
              takeoffAirport: existingFlight.takeoffAirport,
              landingAirport: existingFlight.landingAirport,
              takeoffTime: formatTime(existingFlight.takeoffTime),
              landingTime: formatTime(existingFlight.landingTime),
            });
          }
        });
    }
  }

  inputs: FlightInput[] = [
    {
      label: 'Flight number',
      placeholder: 'ABC123',
      type: 'text',
      key: 'flightNumber',
      warning: 'Must start with 2 capital letters and 4 numbers.',
    },
    {
      label: 'Takeoff Airport',
      placeholder: 'Takeoff Airport',
      type: 'dropdown',
      warning: 'Select an airport from the list',
      key: 'takeoffAirport',
      data: [],
    },
    {
      label: 'Landing Airport',
      placeholder: 'Landing Airport',
      type: 'dropdown',
      key: 'landingAirport',
      warning: 'Select an airport from the list',
      data: [],
    },
    {
      key: 'landingTime',
      label: 'Landing Time',
      placeholder: 'Landing Time',
      type: 'date',
      warning: 'Choose a landing time',
    },
    {
      key: 'takeoffTime',
      label: 'Takeoff Time',
      placeholder: 'Takeoff Time',
      type: 'date',
      warning: 'Choose a takeoff time',
    },
    {
      key: 'status',
      label: 'Status',
      placeholder: 'status',
      type: 'dropdown',
      data: [
        FlightStatus.AIRBORNE,
        FlightStatus.HANGER,
        FlightStatus.MALFUNCTION,
      ],
      warning: 'Type at least 10 numbers',
    },
  ];
  handelChange(e: FlightInput) {
    // console.log('input', this.newFlightForm.get(e.key)?.value);
  }
  onSubmit() {
    const flightData: Flight = {
      id: this.id ?? '',
      flightNumber: this.newFlightForm.get('flightNumber')?.value ?? '',
      status: this.newFlightForm.get('status')?.value ?? FlightStatus.HANGER,
      takeoffAirport: this.newFlightForm.get('takeoffAirport')?.value ?? '',
      landingAirport: this.newFlightForm.get('landingAirport')?.value ?? '',
      takeoffTime: this.newFlightForm.get('takeoffTime')?.value ?? '',
      landingTime: this.newFlightForm.get('landingTime')?.value ?? '',
    };

    this.errorsInputs = [];
    let hasErrors = false;

    for (const key in flightData) {
      const control = this.newFlightForm.get(key as keyof Flight);

      if (
        (!control?.valid || !flightData[key as keyof Flight]) &&
        key !== 'id'
      ) {
        this.errorsInputs.push(key as keyof Flight);
        hasErrors = true;
      } else if (control?.valid && key === 'flightNumber') {
        const regex = /^[A-Z]{2}\d{4}$/;
        if (!regex.test(flightData[key as keyof Flight] as string)) {
          this.errorsInputs.push(key as keyof Flight);
          hasErrors = true;
        }
      }
    }

    if (hasErrors) {
      console.log('Errors found in the following fields:', this.errorsInputs);
      return;
    }
    if (this.id) {
      this.apiService.upadteFlight(flightData).subscribe((data) => {
        if (data) {
          this.requestSent = true;
          setTimeout(() => this.router.navigateByUrl('/'), 1500);
        }
        // console.log(data);
      });
    } else {
      this.apiService.createFlight(flightData).subscribe((data) => {
        if (data) {
          this.requestSent = true;
          setTimeout(() => this.router.navigateByUrl('/'), 1500);
        }
        // console.log(data);
      });
      // console.log('Flight Data:', flightData);
    }
  }

  isAirport(option: any): boolean {
    return !!(option as Airport).id;
  }
  isFlightStatusArray(data: any): data is FlightStatus[] {
    return data && typeof data[0] === 'string';
  }

  isAirportArray(data: any): data is Airport[] {
    return data && typeof data[0] === 'object' && 'id' in data[0];
  }
}
