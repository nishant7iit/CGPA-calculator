
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-8 border-t border-border">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CGPA Calculator Pro. All rights reserved.</p>
        <p className="mt-1">A tool for students to calculate and track their academic performance</p>
      </div>
    </footer>
  );
};

export default Footer;
