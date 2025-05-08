
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Semester, CourseType } from '@/types';
import { calculateCGPA, calculateSGPA, formatNumber } from '@/utils/gradeCalculator';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { exportData } from '@/utils/localStorage';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Download, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface SummaryCardProps {
  semesters: Semester[];
  onClearAllData: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ semesters, onClearAllData }) => {
  const cgpa = calculateCGPA(semesters);
  const progress = cgpa * 10; // Convert to percentage (out of 100)

  const handleExport = () => {
    try {
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(exportData())}`;
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', 'cgpa_data.json');
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  // Course and credit statistics
  const allCourses = semesters.flatMap(semester => semester.courses);
  const countedCourses = allCourses.filter(course => course.type !== 'Additional');
  
  const totalCredits = countedCourses.reduce((sum, course) => sum + course.credits, 0);
  const totalCourses = countedCourses.length;
  
  const additionalCredits = allCourses
    .filter(course => course.type === 'Additional')
    .reduce((sum, course) => sum + course.credits, 0);
  
  // Course type distribution
  const courseTypeCount: Record<CourseType, { count: number, credits: number }> = {} as Record<CourseType, { count: number, credits: number }>;
  
  allCourses.forEach(course => {
    if (!courseTypeCount[course.type]) {
      courseTypeCount[course.type] = { count: 0, credits: 0 };
    }
    courseTypeCount[course.type].count++;
    courseTypeCount[course.type].credits += course.credits;
  });

  const getSGPALabel = (value: number) => {
    if (value >= 9.5) return 'Outstanding';
    if (value >= 8.5) return 'Excellent';
    if (value >= 7.5) return 'Very Good';
    if (value >= 6.5) return 'Good';
    if (value >= 5.5) return 'Average';
    if (value >= 4.5) return 'Fair';
    return 'Needs Improvement';
  };

  // Find best and worst semester
  const semesterSGPAs = semesters.map(semester => {
    return {
      name: semester.name,
      sgpa: calculateSGPA(semester.courses)
    };
  });
  
  const bestSemester = semesterSGPAs.length > 0 
    ? semesterSGPAs.reduce((prev, current) => (prev.sgpa > current.sgpa) ? prev : current)
    : { name: '-', sgpa: 0 };
    
  const worstSemester = semesterSGPAs.length > 0 
    ? semesterSGPAs.reduce((prev, current) => (prev.sgpa < current.sgpa && current.sgpa > 0) ? prev : current)
    : { name: '-', sgpa: 0 };

  return (
    <Card className="w-full card-gradient shadow-md">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-center">Academic Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-1">Cumulative GPA</h3>
          <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {formatNumber(cgpa)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{getSGPALabel(cgpa)}</p>
          <Progress value={progress} className="h-2 mt-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="bg-secondary/60 rounded-lg p-4 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">Total Semesters</p>
            <p className="text-xl md:text-2xl font-bold">{semesters.length}</p>
          </div>
          <div className="bg-secondary/60 rounded-lg p-4 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">Counted Courses</p>
            <p className="text-xl md:text-2xl font-bold">{totalCourses}</p>
          </div>
          <div className="bg-secondary/60 rounded-lg p-4 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">Counted Credits</p>
            <p className="text-xl md:text-2xl font-bold">{totalCredits}</p>
          </div>
          <div className="bg-secondary/60 rounded-lg p-4 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">Additional Credits</p>
            <p className="text-xl md:text-2xl font-bold">{additionalCredits}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="bg-secondary/60 rounded-lg p-4">
            <p className="text-xs md:text-sm text-muted-foreground text-center">Best Semester</p>
            <p className="text-lg font-bold text-center">{bestSemester.name}</p>
            <p className="text-center">{formatNumber(bestSemester.sgpa)}</p>
          </div>
          <div className="bg-secondary/60 rounded-lg p-4">
            <p className="text-xs md:text-sm text-muted-foreground text-center">Lowest SGPA</p>
            <p className="text-lg font-bold text-center">{worstSemester.name}</p>
            <p className="text-center">{formatNumber(worstSemester.sgpa)}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 pt-2">
          <Button className="flex-1" onClick={handleExport}>
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1">
                <Trash size={16} className="mr-2" />
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete all semesters and courses? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearAllData}>
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
