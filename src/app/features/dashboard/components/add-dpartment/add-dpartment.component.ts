import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BaseDepartment } from '../../models/department.js';
import { QuestionsService } from '../../services/questions.service';
import { SmartTableComponent } from 'app/shared/data-table/smart-table-component/smart-table-component';

@Component({
  selector: 'app-add-dpartment',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, CommonModule, SmartTableComponent],
  templateUrl: './add-dpartment.component.html',
  styleUrl: './add-dpartment.component.css'
})
export class AddDpartmentComponent {
  depatementForm: FormGroup;
  depratments = signal<BaseDepartment[]>([]);
  columns = [
    { field: 'dName', header: 'Name' },
    { field: 'description', header: 'Description' }
  ];
  constructor(private fb: FormBuilder, private questionService: QuestionsService) {
    this.depatementForm = this.fb.group({
      dName: ['', Validators.required],
      description: ['', Validators.required]
    })
    this.loaddepartments()
  }
  isInvalid(controlName: string) {
    let control = this.depatementForm.get(controlName)
    return !!(control && control.invalid && (control.dirty || control.touched))
  }
  submitForm() {
    if (this.depatementForm.valid) {
      console.log('Form Submitted:', this.depatementForm.value);

      this.questionService.addepartment(this.depatementForm.value).subscribe({
        next: (result: BaseDepartment) => {
          this.depratments.update(qs => [...qs, this.depatementForm.value]);
          console.log('Department added:', result);
          this.depatementForm.reset();
        },
        error: (error: Error) => {
          console.error('Error adding department:', error);
        }
      });
    } else {
      this.depatementForm.markAllAsTouched();
    }
  }
  loaddepartments() {
    this.questionService.getdepartment().subscribe(data => {
      this.depratments.set(data);
    });
  }
}
