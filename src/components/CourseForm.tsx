
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grade } from '@/types';
import { generateId } from '@/utils/localStorage';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CourseFormProps {
  semesterId: string;
  onAddCourse: (semesterId: string, name: string, grade: Grade, credits: number) => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ semesterId, onAddCourse }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade | ''>('');
  const [credits, setCredits] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a course name');
      return;
    }
    
    if (!grade) {
      toast.error('Please select a grade');
      return;
    }
    
    if (credits === '' || credits <= 0) {
      toast.error('Please enter a valid credit value');
      return;
    }
    
    onAddCourse(semesterId, name, grade, credits);
    setName('');
    setGrade('');
    setCredits('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/50 rounded-lg p-4 shadow-sm border border-border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`course-name-${semesterId}`}>Course Name</Label>
          <Input
            id={`course-name-${semesterId}`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mathematics 101"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`course-grade-${semesterId}`}>Grade</Label>
          <Select value={grade} onValueChange={(value) => setGrade(value as Grade)}>
            <SelectTrigger id={`course-grade-${semesterId}`} className="w-full">
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+ (10 points)</SelectItem>
              <SelectItem value="A">A (10 points)</SelectItem>
              <SelectItem value="A-">A- (9 points)</SelectItem>
              <SelectItem value="B">B (8 points)</SelectItem>
              <SelectItem value="B-">B- (7 points)</SelectItem>
              <SelectItem value="C">C (6 points)</SelectItem>
              <SelectItem value="C-">C- (5 points)</SelectItem>
              <SelectItem value="D">D (4 points)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`course-credits-${semesterId}`}>Credits</Label>
          <div className="flex space-x-2">
            <Input
              id={`course-credits-${semesterId}`}
              type="number"
              min="0.5"
              step="0.5"
              value={credits}
              onChange={(e) => setCredits(e.target.value ? parseFloat(e.target.value) : '')}
              placeholder="e.g. 4"
              className="w-full"
            />
            <Button type="submit" className="flex-shrink-0">
              <Plus size={18} className="mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CourseForm;
