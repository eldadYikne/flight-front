import { Flight } from './flights';

export interface TableColumns {
  key?: keyof Flight;
  title: string;
  action?: 'delete' | 'edit';
}
