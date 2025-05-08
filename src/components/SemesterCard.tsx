
import React from 'react';
import { Course, Grade, Semester, CourseType } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CourseForm from './CourseForm';
import CourseList from './CourseList';
import TypeAnalysis from './TypeAnalysis';
import { calculateSGPA, formatNumber } from '@/utils/gradeCalculator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash, ArrowDown, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SemesterCardProps {
  semester: Semester;
  onAddCourse: (semesterId: string, name: string, grade: Grade, credits: number, type: CourseType) => void;
  onUpdateCourse: (semesterId: string, courseId: string, name: string, grade: Grade, credits: number, type: CourseType) => void;
  onDeleteCourse: (semesterId: string, courseId: string) => void;
  onUpdateSemesterName: (semesterId: string, name: string) => void;
  onDeleteSemester: (semesterId: string) => void;
  onMoveSemesterUp: (semesterId: string) => void;
  onMoveSemesterDown: (semesterId: string) => void;
  onToggleSemesterCollapse: (semesterId: string) => void;
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
  onToggleSemesterCollapse,
  isFirst,
  isLast,
}) => {
  const handleUpdateCourse = (courseId: string, name: string, grade: Grade, credits: number, type: CourseType) => {
    onUpdateCourse(semester.id, courseId, name, grade, credits, type);
  };

  const handleDeleteCourse = (courseId: string) => {
    onDeleteCourse(semester.id, courseId);
  };

  const sgpa = calculateSGPA(semester.courses);
  const countedCourses = semester.courses.filter(course => course.type !== 'Additional');
  const additionalCourses = semester.courses.filter(course => course.type === 'Additional');
  const totalCredits = countedCourses.reduce((sum, course) => sum + course.credits, 0);
  const additionalCredits = additionalCourses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <Card className="w-full animate-fade-in card-gradient shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Input
              value={semester.name}
              onChange={(e) => onUpdateSemesterName(semester.id, e.target.value)}
              className="font-bold text-lg max-w-[250px]"
              placeholder="Semester Name"
            />
            <CollapsibleTrigger asChild onClick={() => onToggleSemesterCollapse(semester.id)}>
              <Button variant="ghost" size="icon">
                {semester.isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </Button>
            </CollapsibleTrigger>
          </div>
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
      <Collapsible open={!semester.isCollapsed} className="w-full">
        <CollapsibleContent>
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
            
            {semester.courses.length > 0 && (
              <div className="mt-4">
                <TypeAnalysis courses={semester.courses} />
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
      <CardFooter className="flex flex-col md:flex-row md:justify-between bg-secondary/50 rounded-b-lg p-4">
        <div className="flex flex-col w-full md:w-auto mb-2 md:mb-0">
          <div className="flex justify-between md:justify-start gap-4">
            <span className="font-medium">Counted Credits: {totalCredits}</span>
            {additionalCredits > 0 && (
              <span className="font-medium text-muted-foreground">
                Additional: {additionalCredits}
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            'Additional' courses are not counted in CGPA
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">SGPA:</span>
          <span className="font-bold text-lg">{formatNumber(sgpa)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SemesterCard;
