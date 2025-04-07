export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  passportNumber: string;
  bio: string;
  phone: string;
  avatarUrl: string;
  emailConfirmedAt: string;
  externalCustomerId: string;
  address: {
    zipCode: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
  };
  roles: {
    id: number;
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
}

export interface PracticeExam {
  id: string;
  exam: Exam;
  title: string;
  description?: string;
  passingScore?: number;
  teacher: User;
  timeLimit?: number;
  difficultyLevel?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface Question {
  id: string;
  questionText: string;
  questionTypeId: number; // 1 for multiple choice, 3 for objective
  practiceExamId: string;
  imageUrl?: string;
  position: number;
}

export interface Alternative {
  id: string;
  content: string;
  isCorrect: boolean;
  questionId: string;
  position: number;
}

export interface ListQuestionsByStudentResponse {
  id: string;
  content: string;
  questionTypeId: number;
  practiceExamId: string;
  imageUrl?: string;
  position: number;
}
