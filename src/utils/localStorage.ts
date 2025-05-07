
import { Semester } from "../types";

const STORAGE_KEY = 'cgpa-calculator-data';

export const saveSemesters = (semesters: Semester[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(semesters));
};

export const loadSemesters = (): Semester[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return [];
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const exportData = (): string => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data || '[]';
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
