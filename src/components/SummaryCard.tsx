
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Semester } from '@/types';
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

  const totalCredits = semesters.reduce((sum, semester) => {
    return sum + semester.courses.reduce((credits, course) => credits + course.credits, 0);
  }, 0);

  const totalCourses = semesters.reduce((sum, semester) => sum + semester.courses.length, 0);

  const getSGPALabel = (value: number) => {
    if (value >= 9.5) return 'Outstanding';
    if (value >= 8.5) return 'Excellent';
    if (value >= 7.5) return 'Very Good';
    if (value >= 6.5) return 'Good';
    if (value >= 5.5) return 'Average';
    if (value >= 4.5) return 'Fair';
    return 'Needs Improvement';
  };

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
            <p className="text-xs md:text-sm text-muted-foreground">Total Courses</p>
            <p className="text-xl md:text-2xl font-bold">{totalCourses}</p>
          </div>
          <div className="bg-secondary/60 rounded-lg p-4 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">Total Credits</p>
            <p className="text-xl md:text-2xl font-bold">{totalCredits}</p>
          </div>
          <div className="bg-secondary/60 rounded-lg p-4 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">Best Semester</p>
            <p className="text-xl md:text-2xl font-bold">
              {semesters.length > 0
                ? formatNumber(Math.max(...semesters.map(s => calculateSGPA(s.courses))))
                : '0.00'}
            </p>
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
