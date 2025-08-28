import type { Note } from './Note';

export default interface User {
  id: string;
  readonly phone: string;
  password?: string;
  fullName: string;
  dob: Date;
  email: string;
  gender: string;
  notes?: Array<Note>;
}
