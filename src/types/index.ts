
export type Grade = 'A' | 'A+' | 'A-' | 'B' | 'B-' | 'C' | 'C-' | 'D';

export type CourseType = 
  | 'Dept Elective' 
  | 'Free Elective'
  | 'Minor'
  | 'Major'
  | 'Lab'
  | 'Liberal Arts'
  | 'Creative Arts'
  | 'Additional'
  | 'Others';

export interface Course {
  id: string;
  name: string;
  grade: Grade;
  credits: number;
  type: CourseType;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
}
