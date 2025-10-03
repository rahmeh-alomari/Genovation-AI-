import { Component, computed, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { QuestionsService } from '../../services/questions.service';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NewQuestion, Question } from '../../models/questions.js';
import { SmartTableComponent } from 'app/shared/data-table/smart-table-component/smart-table-component';
import { CardComponent } from 'app/shared/data-card/card/card.component';

@Component({
  selector: 'app-add-questions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    CardComponent,
    RadioButtonModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    SmartTableComponent,
  ],
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.css']
})
export class AddQuestionsComponent {
  questionType: 'essay' | 'multiple-choice' = 'essay';
  newQuestion: NewQuestion = this.getEmptyQuestion('essay');
  correctAnswerSingle: string | null = null;

  questions = signal<Question[]>([]);

  columns = [
    { field: 'department', header: 'Department' },
    { field: 'type', header: 'Type' },
    { field: 'question', header: 'Question' },
    { field: 'required', header: 'Required' }
  ];

  constructor(private questionService: QuestionsService) {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService.getQuestions().subscribe(data => {
      this.questions.set(data);
    });
  }

  getEmptyQuestion(type: 'essay' | 'multiple-choice'): NewQuestion {
    return {
      id: uuidv4(),
      type,
      question: '',
      required: true,
      department: '',
      maxLength: type === 'essay' ? 300 : null,
      options: type === 'multiple-choice' ? [''] : [],
      correctAnswers: [],
      multipleSelection: false,
    };
  }

  resetForm() {
    this.newQuestion = this.getEmptyQuestion(this.questionType);
    this.correctAnswerSingle = null;
  }

  addOption() {
    this.newQuestion.options ??= [];
    this.newQuestion.options.push('');
  }

  removeOption(index: number) {
    if (!this.newQuestion.options) return;

    const removedOption = this.newQuestion.options[index];
    this.newQuestion.options.splice(index, 1);

    if (this.newQuestion.multipleSelection) {
      this.newQuestion.correctAnswers = this.newQuestion.correctAnswers.filter(
        ans => ans !== removedOption
      );
    } else if (this.correctAnswerSingle === removedOption) {
      this.correctAnswerSingle = null;
    }
  }
  submit() {
  const id = uuidv4();
  let question: Question;
  if (this.questionType === 'essay') {
    question = {
      id,
      type: 'essay',
      question: this.newQuestion.question,
      required: this.newQuestion.required,
      department: this.newQuestion.department,
      maxLength: this.newQuestion.maxLength ?? 300,
    };
  } else {
    question = {
      id,
      type: 'multiple-choice',
      question: this.newQuestion.question,
      required: this.newQuestion.required,
      department: this.newQuestion.department,
      options: this.newQuestion.options.filter(o => o.trim() !== ''),
      correctAnswers: this.newQuestion.multipleSelection
        ? this.newQuestion.correctAnswers
        : this.correctAnswerSingle
          ? [this.correctAnswerSingle]
          : [],
      multipleSelection: this.newQuestion.multipleSelection ?? false,
    };
  }
  this.questionService.addQuestion(question).subscribe(() => {
    this.questions.update(qs => [...qs, question]); 
    this.resetForm();
  });
}
}
