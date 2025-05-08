
import React, { useState } from 'react';
import { Course, Grade, CourseType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { gradePoints } from '@/utils/gradeCalculator';
import { Pencil, Trash, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface CourseListProps {
  courses: Course[];
  onUpdateCourse: (courseId: string, name: string, grade: Grade, credits: number, type: CourseType) => void;
  onDeleteCourse: (courseId: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, onUpdateCourse, onDeleteCourse }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editGrade, setEditGrade] = useState<Grade | ''>('');
  const [editCredits, setEditCredits] = useState<number | ''>('');
  const [editType, setEditType] = useState<CourseType>('Others');

  const startEditing = (course: Course) => {
    setEditingId(course.id);
    setEditName(course.name);
    setEditGrade(course.grade);
    setEditCredits(course.credits);
    setEditType(course.type);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = (courseId: string) => {
    if (!editName.trim()) {
      toast.error('Course name cannot be empty');
      return;
    }

    if (!editGrade) {
      toast.error('Please select a grade');
      return;
    }

    if (editCredits === '' || editCredits <= 0) {
      toast.error('Please enter a valid credit value');
      return;
    }

    onUpdateCourse(courseId, editName, editGrade, editCredits as number, editType);
    setEditingId(null);
  };

  if (courses.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No courses added yet</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full mt-4">
        <thead>
          <tr className="bg-secondary text-secondary-foreground">
            <th className="p-3 text-left rounded-tl-lg">Course Name</th>
            <th className="p-3 text-center">Grade</th>
            <th className="p-3 text-center">Points</th>
            <th className="p-3 text-center">Credits</th>
            <th className="p-3 text-center">Type</th>
            <th className="p-3 text-right rounded-tr-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              {editingId === course.id ? (
                <>
                  <td className="p-3">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Course name"
                      className="w-full"
                    />
                  </td>
                  <td className="p-3">
                    <Select value={editGrade} onValueChange={(value) => setEditGrade(value as Grade)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="C-">C-</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3 text-center">
                    {editGrade ? gradePoints[editGrade] : '-'}
                  </td>
                  <td className="p-3">
                    <Input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={editCredits}
                      onChange={(e) => setEditCredits(e.target.value ? parseFloat(e.target.value) : '')}
                      placeholder="Credits"
                      className="w-full text-center"
                    />
                  </td>
                  <td className="p-3">
                    <Select value={editType} onValueChange={(value) => setEditType(value as CourseType)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Core">Core</SelectItem>
                        <SelectItem value="Basic Engineering">Basic Engineering</SelectItem>
                        <SelectItem value="Basic Science">Basic Science</SelectItem>
                        <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                        <SelectItem value="Inside Basket">Inside Basket</SelectItem>
                        <SelectItem value="Outside Basket">Outside Basket</SelectItem>
                        <SelectItem value="Major">Major</SelectItem>
                        <SelectItem value="Minor">Minor</SelectItem>
                        <SelectItem value="Dept Elective">Dept Elective</SelectItem>
                        <SelectItem value="Free Elective">Free Elective</SelectItem>
                        <SelectItem value="Lab">Lab</SelectItem>
                        <SelectItem value="Liberal Arts">Liberal Arts</SelectItem>
                        <SelectItem value="Creative Arts">Creative Arts</SelectItem>
                        <SelectItem value="Additional">Additional</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={cancelEditing}>
                        <X size={16} />
                      </Button>
                      <Button size="sm" onClick={() => saveEdit(course.id)}>
                        <Save size={16} />
                      </Button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-3">{course.name}</td>
                  <td className="p-3 text-center">{course.grade}</td>
                  <td className="p-3 text-center">{gradePoints[course.grade]}</td>
                  <td className="p-3 text-center">{course.credits}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${course.type === 'Additional' ? 'bg-gray-200 text-gray-700' : 'bg-primary/20 text-primary'}`}>
                      {course.type}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEditing(course)}>
                        <Pencil size={16} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDeleteCourse(course.id)}>
                        <Trash size={16} />
                      </Button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList;
