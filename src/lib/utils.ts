import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { QuestionType } from '../app/model/nahero.type';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getDifficultyLabel(level: number): string {
  switch (level) {
    case 1:
      return 'Foundational';
    case 2:
      return 'Associate';
    case 3:
      return 'Professional';
    case 4:
      return 'Specialty';
    default:
      return 'Unknown';
  }
}

export function formatTimeLimit(minutes?: number): string {
  if (!minutes) return 'No time limit';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes} minutes`;
}

export function getQuestionTypeLabel(typeId: number): string {
  switch (typeId) {
    case QuestionType.MULTIPLE_CHOICE:
      return 'Multiple Choice';
    case QuestionType.TRUE_FALSE:
      return 'True/False';
    case QuestionType.OBJECTIVE:
      return 'Objective';
    case QuestionType.DESCRIPTIVE:
      return 'Dissertative';
    case QuestionType.SUM:
      return 'Sum';
    default:
      return 'Unknown';
  }
}
