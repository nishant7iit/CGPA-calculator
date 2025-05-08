
import React from 'react';
import { CourseType } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';

interface CourseFiltersProps {
  selectedTypes: CourseType[];
  onTypeChange: (types: CourseType[]) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({ selectedTypes, onTypeChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // All available course types
  const allTypes: CourseType[] = [
    'Core',
    'Basic Engineering',
    'Basic Science',
    'Soft Skills',
    'Inside Basket',
    'Outside Basket',
    'Dept Elective',
    'Free Elective',
    'Minor',
    'Major',
    'Lab',
    'Liberal Arts',
    'Creative Arts',
    'Additional',
    'Others'
  ];

  const handleTypeToggle = (type: CourseType) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  const selectAll = () => {
    onTypeChange([...allTypes]);
  };

  const clearAll = () => {
    onTypeChange([]);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center justify-between">
        <Label>Filter Courses</Label>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Filter size={16} />
            {isOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="mt-4">
        <div className="bg-background border rounded-lg p-4">
          <div className="flex justify-between mb-4">
            <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
            <Button variant="outline" size="sm" onClick={clearAll}>Clear All</Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {allTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`filter-${type}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => handleTypeToggle(type)}
                />
                <label
                  htmlFor={`filter-${type}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CourseFilters;
