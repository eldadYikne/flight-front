export interface Flight {
  id?: string;
  flightNumber: string;
  status: FlightStatus;
  takeoffAirport: string;
  landingAirport: string;
  takeoffTime: string;
  landingTime: string;
  landingdilayTime?: string;
  takeoffdilayTime?: string;
}
export enum FlightStatus {
  HANGER = 'HANGER',
  AIRBORNE = 'AIRBORNE',
  MALFUNCTION = 'MALFUNCTION',
}
