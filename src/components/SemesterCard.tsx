
import React from 'react';
import { Course, Grade, Semester } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CourseForm from './CourseForm';
import CourseList from './CourseList';
import { calculateSGPA, formatNumber } from '@/utils/gradeCalculator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash, ArrowDown, ArrowUp } from 'lucide-react';

interface SemesterCardProps {
  semester: Semester;
  onAddCourse: (semesterId: string, name: string, grade: Grade, credits: number) => void;
  onUpdateCourse: (semesterId: string, courseId: string, name: string, grade: Grade, credits: number) => void;
  onDeleteCourse: (semesterId: string, courseId: string) => void;
  onUpdateSemesterName: (semesterId: string, name: string) => void;
  onDeleteSemester: (semesterId: string) => void;
  onMoveSemesterUp: (semesterId: string) => void;
  onMoveSemesterDown: (semesterId: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

const SemesterCard: React.FC<SemesterCardProps> = ({
  semester,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onUpdateSemesterName,
  onDeleteSemester,
  onMoveSemesterUp,
  onMoveSemesterDown,
  isFirst,
  isLast,
}) => {
  const handleUpdateCourse = (courseId: string, name: string, grade: Grade, credits: number) => {
    onUpdateCourse(semester.id, courseId, name, grade, credits);
  };

  const handleDeleteCourse = (courseId: string) => {
    onDeleteCourse(semester.id, courseId);
  };

  const sgpa = calculateSGPA(semester.courses);

  return (
    <Card className="w-full animate-fade-in card-gradient shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Input
            value={semester.name}
            onChange={(e) => onUpdateSemesterName(semester.id, e.target.value)}
            className="font-bold text-lg max-w-[250px]"
            placeholder="Semester Name"
          />
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveSemesterUp(semester.id)}
              disabled={isFirst}
            >
              <ArrowUp size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveSemesterDown(semester.id)}
              disabled={isLast}
            >
              <ArrowDown size={16} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Semester</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {semester.name}? This will remove all courses in this semester.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDeleteSemester(semester.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <CourseForm
          semesterId={semester.id}
          onAddCourse={onAddCourse}
        />
        <CourseList
          courses={semester.courses}
          onUpdateCourse={handleUpdateCourse}
          onDeleteCourse={handleDeleteCourse}
        />
      </CardContent>
      <CardFooter className="flex justify-between bg-secondary/50 rounded-b-lg">
        <span className="font-medium">Total Credits: {semester.courses.reduce((sum, course) => sum + course.credits, 0)}</span>
        <div className="flex items-center gap-2">
          <span className="font-medium">SGPA:</span>
          <span className="font-bold text-lg">{formatNumber(sgpa)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SemesterCard;
