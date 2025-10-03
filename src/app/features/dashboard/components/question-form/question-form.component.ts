import { Component, OnInit } from '@angular/core';
import { Question, EssayQuestion, MultipleChoiceQuestion } from '../../models/questions';
import { QuestionsService } from '../../services/questions.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, AccordionModule],
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {
  questions: Question[] = [];
  answers: { [key: string]: any } = {};

  constructor(private questionService: QuestionsService) {}

  ngOnInit() {
    this.loadQuestions();
  }

loadQuestions() {
  this.questionService.getQuestions().subscribe({
    next: (res: Question[]) => {  // res is the array directly
      this.questions = res;       // assign directly, not res.questions
      this.initAnswers();
    },
    error: (err: Error) => {
      console.error('Error loading questions:', err);
    }
  });
}


getSafeId(questionId: string, option: string): string {
  // Replace spaces and special chars with dashes or remove
  return `${questionId}-${option.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '')}`;
}

 initAnswers() {
  if (!this.questions || !Array.isArray(this.questions)) {
    console.warn('Questions data is missing or not an array');
    return;
  }
  this.questions.forEach(q => {
    if (this.isMultipleChoiceQuestion(q) && q.multipleSelection) {
      this.answers[q.id] = [];
    } else {
      this.answers[q.id] = '';
    }
  });
}

  isEssayQuestion(q: Question): q is EssayQuestion {
    return q.type === 'essay';
  }

  isMultipleChoiceQuestion(q: Question): q is MultipleChoiceQuestion {
    return q.type === 'multiple-choice';
  }

  getMaxLength(q: Question): number | null {
    return this.isEssayQuestion(q) ? q.maxLength : null;
  }

  getOptions(q: Question): string[] {
    return this.isMultipleChoiceQuestion(q) ? q.options : [];
  }

  isMultipleSelection(q: Question): boolean {
    return this.isMultipleChoiceQuestion(q) ? q.multipleSelection : false;
  }

  isSelected(q: Question, option: string): boolean {
    if (this.isMultipleSelection(q)) {
      return this.answers[q.id]?.includes(option);
    } else {
      return this.answers[q.id] === option;
    }
  }

  onAnswerChange(q: Question, event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.isMultipleSelection(q)) {
      if (!Array.isArray(this.answers[q.id])) {
        this.answers[q.id] = [];
      }
      if (input.checked) {
        if (!this.answers[q.id].includes(input.value)) {
          this.answers[q.id].push(input.value);
        }
      } else {
        const index = this.answers[q.id].indexOf(input.value);
        if (index > -1) {
          this.answers[q.id].splice(index, 1);
        }
      }
    } else {
      this.answers[q.id] = input.value;
    }
  }
  get allRequiredAnswered(): boolean {
    return this.questions
      .filter(q => q.required)
      .every(q => {
        const answer = this.answers[q.id];
        if (q.type === 'essay') {
          return answer && answer.trim().length > 0;
        } else if (q.type === 'multiple-choice') {
          if (q.multipleSelection) {
            return Array.isArray(answer) && answer.length > 0;
          } else {
            return !!answer;
          }
        }
        return false;
      });
  }
  submit() {
  const unanswered = this.questions.filter(q => {
    const answer = this.answers[q.id];

    if (q.required) {
      if (this.isEssayQuestion(q)) {
        return !answer || answer.trim().length === 0;
      }

      if (this.isMultipleChoiceQuestion(q)) {
        return q.multipleSelection
          ? !Array.isArray(answer) || answer.length === 0
          : !answer;
      }
    }

    return false;
  });

  if (unanswered.length > 0) {
    alert('Please answer all required questions before submitting.');
    return;
  }

  // ✅ Use your service
  this.questionService.submitAnswers(this.answers).subscribe({
    next: () => {
      this.resetForm(); // Reset after success
    },
    error: (err: any) => {
      console.error(err);
    }
  });
}
resetForm() {
  this.answers = {};
}
}
