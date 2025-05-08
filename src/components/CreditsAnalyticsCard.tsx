
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Semester, CourseType } from '@/types';
import { Progress } from '@/components/ui/progress';
import { calculateCGPA, formatNumber } from '@/utils/gradeCalculator';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { ChartPie, BookOpen, Layers, GraduationCap } from 'lucide-react';

interface CreditsAnalyticsCardProps {
  semesters: Semester[];
}

const CreditsAnalyticsCard: React.FC<CreditsAnalyticsCardProps> = ({ semesters }) => {
  // Get all courses across all semesters
  const allCourses = semesters.flatMap(semester => semester.courses);
  
  // Filter courses by type
  const majorCourses = allCourses.filter(course => 
    ['Core', 'Major', 'Dept Elective'].includes(course.type) && course.type !== 'Additional');
  
  const minorCourses = allCourses.filter(course => 
    ['Minor'].includes(course.type) && course.type !== 'Additional');
  
  // Calculate separate CGPA for major and minor courses
  const majorCGPA = calculateCGPA(semesters.map(semester => ({
    ...semester,
    courses: semester.courses.filter(course => 
      ['Core', 'Major', 'Dept Elective'].includes(course.type) && course.type !== 'Additional')
  })));
  
  const minorCGPA = calculateCGPA(semesters.map(semester => ({
    ...semester,
    courses: semester.courses.filter(course => 
      ['Minor'].includes(course.type) && course.type !== 'Additional')
  })));

  // Credits analysis
  const courseTypes = [
    'Core', 'Basic Engineering', 'Basic Science', 'Soft Skills',
    'Inside Basket', 'Outside Basket', 'Dept Elective', 'Free Elective',
    'Minor', 'Major', 'Lab', 'Liberal Arts', 'Creative Arts'
  ];

  // Group credits by course type
  const creditsByType: Record<CourseType, number> = {} as Record<CourseType, number>;
  
  courseTypes.forEach(type => {
    creditsByType[type as CourseType] = allCourses
      .filter(course => course.type === type && course.type !== 'Additional')
      .reduce((sum, course) => sum + course.credits, 0);
  });

  // Total credits (excluding Additional courses)
  const totalCredits = allCourses
    .filter(course => course.type !== 'Additional')
    .reduce((sum, course) => sum + course.credits, 0);

  // Create data for the bar chart
  const chartData = Object.entries(creditsByType)
    .filter(([_, credits]) => credits > 0) // Only include types with credits
    .map(([type, credits]) => ({
      type,
      credits,
      percentage: totalCredits > 0 ? (credits / totalCredits) * 100 : 0
    }))
    .sort((a, b) => b.credits - a.credits); // Sort by credits in descending order

  // Colors for the chart
  const colors = [
    '#8b5cf6', '#d946ef', '#f97316', '#0ea5e9', '#10b981', 
    '#6366f1', '#ec4899', '#f59e0b', '#3b82f6', '#14b8a6'
  ];

  // Category analysis
  const categorizedTypes: Record<string, CourseType[]> = {
    'Core Subjects': ['Core', 'Major', 'Lab'],
    'Basic Foundation': ['Basic Engineering', 'Basic Science', 'Soft Skills'],
    'Electives': ['Inside Basket', 'Outside Basket', 'Dept Elective', 'Free Elective'],
    'Liberal Education': ['Liberal Arts', 'Creative Arts'],
    'Minor Specialization': ['Minor']
  };

  const categoryAnalysis = Object.entries(categorizedTypes).map(([category, types]) => {
    const credits = types.reduce((sum, type) => sum + (creditsByType[type] || 0), 0);
    return { category, credits };
  }).filter(item => item.credits > 0);

  // Calculate the estimated total program credits (typically 120-180 for a 4-year degree)
  // This is an assumption; in a real app, this would come from a configuration
  const estimatedTotalCredits = 180;
  const creditProgress = (totalCredits / estimatedTotalCredits) * 100;

  return (
    <Card className="w-full card-gradient shadow-md animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl md:text-2xl">Credits Analytics</CardTitle>
        <ChartPie className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Credit Progress */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Degree Progress</span>
            <span className="text-sm font-medium">{Math.round(creditProgress)}%</span>
          </div>
          <Progress value={creditProgress} className="h-2" />
          <div className="text-xs text-muted-foreground text-right">
            {totalCredits} of ~{estimatedTotalCredits} estimated credits
          </div>
        </div>

        {/* Major vs Minor CGPA */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/60 rounded-lg p-4 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">Major CGPA</p>
            </div>
            <p className="text-2xl font-bold">{formatNumber(majorCGPA)}</p>
            <p className="text-xs text-muted-foreground">{majorCourses.length} courses</p>
          </div>
          <div className="bg-secondary/60 rounded-lg p-4 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">Minor CGPA</p>
            </div>
            <p className="text-2xl font-bold">{minorCourses.length > 0 ? formatNumber(minorCGPA) : "N/A"}</p>
            <p className="text-xs text-muted-foreground">{minorCourses.length} courses</p>
          </div>
        </div>

        {/* Credits by Category */}
        <div>
          <h3 className="text-sm font-medium mb-2">Credits by Category</h3>
          <div className="space-y-2">
            {categoryAnalysis.map((category, index) => (
              <div key={category.category} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{category.category}</span>
                  <span>{category.credits} credits</span>
                </div>
                <Progress 
                  value={(category.credits / totalCredits) * 100} 
                  className="h-1.5"
                  style={{
                    backgroundColor: `${colors[index % colors.length]}20`,
                    '--tw-progress-fill': colors[index % colors.length]
                  } as React.CSSProperties}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Credits Distribution Chart */}
        {chartData.length > 0 && (
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-4">Credits Distribution by Course Type</h3>
            <div className="h-64">
              <ChartContainer
                config={{
                  credits: { color: "#8b5cf6" },
                  type: {}
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 5, left: 0, bottom: 25 }}
                  >
                    <XAxis 
                      dataKey="type" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis hide={true} />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltipContent
                              active={active}
                              payload={payload}
                            />
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="credits" name="Credits" radius={[4, 4, 0, 0]}>
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        )}

        {/* Summary note */}
        <div className="text-xs text-muted-foreground italic border-t pt-2 border-border/50">
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5" />
            <span>Visualizing your academic journey through credit distribution</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditsAnalyticsCard;
