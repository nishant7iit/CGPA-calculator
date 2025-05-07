
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import SemesterCard from '@/components/SemesterCard';
import SummaryCard from '@/components/SummaryCard';
import HowToUse from '@/components/HowToUse';
import Footer from '@/components/Footer';
import { Course, Grade, Semester } from '@/types';
import { generateId, saveSemesters, loadSemesters, clearAllData } from '@/utils/localStorage';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const savedSemesters = loadSemesters();
    if (savedSemesters.length > 0) {
      setSemesters(savedSemesters);
    } else {
      // Add a default first semester for new users
      const defaultSemester: Semester = {
        id: generateId(),
        name: 'Semester 1',
        courses: []
      };
      setSemesters([defaultSemester]);
      saveSemesters([defaultSemester]);
    }
  }, []);

  useEffect(() => {
    saveSemesters(semesters);
  }, [semesters]);

  const addSemester = () => {
    const newSemester: Semester = {
      id: generateId(),
      name: `Semester ${semesters.length + 1}`,
      courses: []
    };
    setSemesters([...semesters, newSemester]);
    toast.success('New semester added!');
  };

  const addCourse = (semesterId: string, name: string, grade: Grade, credits: number) => {
    setSemesters(semesters.map(semester => {
      if (semester.id === semesterId) {
        return {
          ...semester,
          courses: [...semester.courses, {
            id: generateId(),
            name,
            grade,
            credits
          }]
        };
      }
      return semester;
    }));
    toast.success('Course added!');
  };

  const updateCourse = (semesterId: string, courseId: string, name: string, grade: Grade, credits: number) => {
    setSemesters(semesters.map(semester => {
      if (semester.id === semesterId) {
        return {
          ...semester,
          courses: semester.courses.map(course => {
            if (course.id === courseId) {
              return { ...course, name, grade, credits };
            }
            return course;
          })
        };
      }
      return semester;
    }));
    toast.success('Course updated!');
  };

  const deleteCourse = (semesterId: string, courseId: string) => {
    setSemesters(semesters.map(semester => {
      if (semester.id === semesterId) {
        return {
          ...semester,
          courses: semester.courses.filter(course => course.id !== courseId)
        };
      }
      return semester;
    }));
    toast.success('Course deleted!');
  };

  const updateSemesterName = (semesterId: string, name: string) => {
    setSemesters(semesters.map(semester => {
      if (semester.id === semesterId) {
        return { ...semester, name };
      }
      return semester;
    }));
  };

  const deleteSemester = (semesterId: string) => {
    setSemesters(semesters.filter(semester => semester.id !== semesterId));
    toast.success('Semester deleted!');
  };

  const handleClearAllData = () => {
    clearAllData();
    setSemesters([]);
    toast.success('All data has been cleared!');
    // Add default semester after clearing
    setTimeout(() => {
      const defaultSemester: Semester = {
        id: generateId(),
        name: 'Semester 1',
        courses: []
      };
      setSemesters([defaultSemester]);
    }, 500);
  };

  const moveSemesterUp = (semesterId: string) => {
    const index = semesters.findIndex(s => s.id === semesterId);
    if (index > 0) {
      const newSemesters = [...semesters];
      [newSemesters[index - 1], newSemesters[index]] = [newSemesters[index], newSemesters[index - 1]];
      setSemesters(newSemesters);
    }
  };

  const moveSemesterDown = (semesterId: string) => {
    const index = semesters.findIndex(s => s.id === semesterId);
    if (index < semesters.length - 1) {
      const newSemesters = [...semesters];
      [newSemesters[index], newSemesters[index + 1]] = [newSemesters[index + 1], newSemesters[index]];
      setSemesters(newSemesters);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/30">
      <Header />
      
      <main className="container mx-auto px-4 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex gap-4">
              <Button onClick={addSemester}>
                <Plus size={18} className="mr-1" />
                Add New Semester
              </Button>
              <Button variant="outline" onClick={() => setShowGuide(!showGuide)}>
                {showGuide ? 'Hide Guide' : 'How to Use'}
              </Button>
            </div>
          </div>
          
          {showGuide && <HowToUse />}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              {semesters.map((semester, index) => (
                <SemesterCard
                  key={semester.id}
                  semester={semester}
                  onAddCourse={addCourse}
                  onUpdateCourse={updateCourse}
                  onDeleteCourse={deleteCourse}
                  onUpdateSemesterName={updateSemesterName}
                  onDeleteSemester={deleteSemester}
                  onMoveSemesterUp={moveSemesterUp}
                  onMoveSemesterDown={moveSemesterDown}
                  isFirst={index === 0}
                  isLast={index === semesters.length - 1}
                />
              ))}
              
              {semesters.length === 0 && (
                <div className="text-center py-12 bg-white/50 rounded-lg border border-border">
                  <p className="text-muted-foreground">No semesters found. Add a new semester to get started.</p>
                  <Button onClick={addSemester} className="mt-4">
                    <Plus size={18} className="mr-1" />
                    Add New Semester
                  </Button>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <SummaryCard
                semesters={semesters}
                onClearAllData={handleClearAllData}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
