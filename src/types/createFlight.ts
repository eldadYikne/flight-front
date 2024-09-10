import { Airport } from './airport';
import { Flight, FlightStatus } from './flights';

export interface FlightInput {
  key: keyof Flight;
  placeholder: string;
  type: 'dropdown' | 'text' | 'date';
  label: string;
  warning: string;
  data?: Airport[] | FlightStatus[];
}
