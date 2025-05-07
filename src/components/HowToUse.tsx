
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HowToUse = () => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-center">How to Use the CGPA Calculator</h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="about">
          <AccordionTrigger>About this Calculator</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              This CGPA Calculator uses the following grading system:
              <ul className="list-disc pl-5 mt-2">
                <li>A, A+ = 10 points</li>
                <li>A- = 9 points</li>
                <li>B = 8 points</li>
                <li>B- = 7 points</li>
                <li>C = 6 points</li>
                <li>C- = 5 points</li>
                <li>D = 4 points</li>
              </ul>
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="step1">
          <AccordionTrigger>Step 1: Create Semesters</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              Start by clicking the "Add New Semester" button. You can rename the semester by clicking on its title.
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="step2">
          <AccordionTrigger>Step 2: Add Courses</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              For each semester, add your courses by filling in:
              <ul className="list-disc pl-5 mt-2">
                <li>Course Name (e.g., Mathematics 101)</li>
                <li>Grade Received (select from dropdown)</li>
                <li>Credit Value (e.g., 3 or 4)</li>
              </ul>
              Then click the "Add" button to add the course to your semester.
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="step3">
          <AccordionTrigger>Step 3: Manage Your Data</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              You can:
              <ul className="list-disc pl-5 mt-2">
                <li>Edit courses by clicking the pencil icon</li>
                <li>Delete courses using the trash icon</li>
                <li>Reorder semesters using the up/down arrows</li>
                <li>Delete entire semesters with the trash icon in the semester header</li>
              </ul>
              All changes are automatically saved to your browser's local storage.
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="calculations">
          <AccordionTrigger>How Calculations Work</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              <strong>SGPA (Semester GPA):</strong><br />
              SGPA = Sum of (Grade Points × Credits) / Total Credits<br /><br />
              
              <strong>CGPA (Cumulative GPA):</strong><br />
              CGPA = Average of all semester SGPAs
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="export">
          <AccordionTrigger>Exporting Your Data</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              You can export all your data as a JSON file by clicking the "Export Data" button in the Academic Summary card. This file can be saved for backup purposes.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default HowToUse;
