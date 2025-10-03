export type QuestionType = 'essay' | 'multiple-choice';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  department?: string; 
}

export interface EssayQuestion extends BaseQuestion {
  type: 'essay';
  maxLength: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswers: string[];
  multipleSelection: boolean;
}

export type Question = EssayQuestion | MultipleChoiceQuestion;
export type NewQuestion = {
  id: string;
  type: 'essay' | 'multiple-choice';
  question: string;
  required: boolean;
  department: string;
  maxLength?: number | null;
  options: string[];          
  correctAnswers: string[]; 
  multipleSelection?: boolean;
};
