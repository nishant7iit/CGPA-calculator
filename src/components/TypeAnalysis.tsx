
import React from 'react';
import { Course, CourseType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TypeAnalysisProps {
  courses: Course[];
}

const TypeAnalysis: React.FC<TypeAnalysisProps> = ({ courses }) => {
  // Group courses by type and count them
  const coursesByType: Record<string, number> = {};
  const creditsByType: Record<string, number> = {};
  
  courses.forEach(course => {
    if (!coursesByType[course.type]) {
      coursesByType[course.type] = 0;
      creditsByType[course.type] = 0;
    }
    coursesByType[course.type]++;
    creditsByType[course.type] += course.credits;
  });
  
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Course Type Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {Object.entries(coursesByType).map(([type, count]) => (
            <div key={type} className="bg-secondary/40 p-2 rounded-md">
              <div className="font-medium">{type}</div>
              <div className="flex justify-between text-xs">
                <span>{count} courses</span>
                <span>{creditsByType[type]} credits</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TypeAnalysis;
