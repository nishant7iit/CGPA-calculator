
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 text-center">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          CGPA Calculator Pro
        </h1>
        <div className="mt-4 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">
            Calculate your Semester GPA and Cumulative GPA
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="ml-2">
                <Info size={16} className="text-muted-foreground hover:text-primary transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="text-sm">
                  <p className="font-semibold mb-2">How to calculate SGPA:</p>
                  <p>SGPA = Sum of (Grade Points × Credits) / Total Credits</p>
                  <p className="font-semibold mt-2 mb-2">How to calculate CGPA:</p>
                  <p>CGPA = Average of all semester SGPAs</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
