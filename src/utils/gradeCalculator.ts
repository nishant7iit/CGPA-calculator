
import { Course, Grade, Semester } from "../types";

export const gradePoints: Record<Grade, number> = {
  'A': 10,
  'A+': 10,
  'A-': 9,
  'B': 8,
  'B-': 7,
  'C': 6,
  'C-': 5,
  'D': 4
};

export const calculateSGPA = (courses: Course[]): number => {
  if (courses.length === 0) return 0;
  
  // Filter out 'Additional' course types
  const countedCourses = courses.filter(course => course.type !== 'Additional');
  
  if (countedCourses.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  countedCourses.forEach(course => {
    const points = gradePoints[course.grade];
    totalPoints += points * course.credits;
    totalCredits += course.credits;
  });
  
  return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
};

export const calculateCGPA = (semesters: Semester[]): number => {
  const allCourses = semesters.flatMap(semester => semester.courses);
  // Filter out 'Additional' course types
  const countedCourses = allCourses.filter(course => course.type !== 'Additional');
  
  if (countedCourses.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  countedCourses.forEach(course => {
    const points = gradePoints[course.grade];
    totalPoints += points * course.credits;
    totalCredits += course.credits;
  });
  
  return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
};

export const formatNumber = (num: number): string => {
  return num.toFixed(2);
};
