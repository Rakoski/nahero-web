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
      return 'Fundação';
    case 2:
      return 'Associado';
    case 3:
      return 'Profissional';
    case 4:
      return 'Especialidade';
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
      return 'Múltipla Escolha';
    case QuestionType.TRUE_FALSE:
      return 'Verdadeiro/Falso';
    case QuestionType.OBJECTIVE:
      return 'Objetiva';
    case QuestionType.DESCRIPTIVE:
      return 'Dissertativa';
    case QuestionType.SUM:
      return 'Soma';
    default:
      return 'Desconhecido';
  }
}
