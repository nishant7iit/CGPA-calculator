
export type Grade = 'A' | 'A+' | 'A-' | 'B' | 'B-' | 'C' | 'C-' | 'D';

export interface Course {
  id: string;
  name: string;
  grade: Grade;
  credits: number;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
}
